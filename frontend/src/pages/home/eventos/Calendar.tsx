import { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/calendar.css";
import type { Evento } from "../../../utils/tipos";
import { normalizarTexto } from "../../../utils/formatacoes";

interface DiaSemana {
  numero: number;
  nome: string;
  data: string;
  isToday: boolean;
}

type ViewMode = "daily" | "weekly" | "monthly";

interface GridDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string;
}

const formatarDataLocal = (date: Date): string => {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const getDayName = (dayIndex: number): string => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return days[dayIndex];
};

export const Calendar = () => {
  const [busca, setBusca] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [, setHoraAtualIndex] = useState<number | null>(null);

  const [view, setView] = useState<ViewMode>("monthly");
  const [currentDate, setCurrentDate] = useState(new Date());

  const horas = Array.from({ length: 16 }, (_, i) =>
    (5 + i).toString().padStart(2, "0")
  );

  const getDailyView = (date: Date): DiaSemana[] => {
    const today = new Date();
    const isToday = formatarDataLocal(date) === formatarDataLocal(today);
    return [
      {
        numero: date.getDate(),
        nome: getDayName(date.getDay()),
        data: formatarDataLocal(date),
        isToday,
      },
    ];
  };

  const getWeeklyView = (date: Date): DiaSemana[] => {
    const today = new Date();
    const weekDays: DiaSemana[] = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const isToday =
        formatarDataLocal(currentDate) === formatarDataLocal(today);

      weekDays.push({
        numero: currentDate.getDate(),
        nome: getDayName(currentDate.getDay()),
        data: formatarDataLocal(currentDate),
        isToday,
      });
    }
    return weekDays;
  };

  const getDaysForTimelineView = (): DiaSemana[] => {
    if (filtroData) {
      const dataFiltrada = new Date(filtroData + "T12:00:00");
      return getDailyView(dataFiltrada);
    }
    switch (view) {
      case "daily":
        return getDailyView(currentDate);
      case "weekly":
        return getWeeklyView(currentDate);
      default:
        return getWeeklyView(currentDate);
    }
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "daily":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "daily":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setFiltroData("");
  };

  const getViewTitle = (): string => {
    if (filtroData) {
      const d = new Date(filtroData + "T12:00:00");
      return d.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };

    if (view === "daily") {
      options.day = "numeric";
      return currentDate.toLocaleDateString("pt-BR", options);
    }
    if (view === "weekly") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
      })} - ${end.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
    return currentDate.toLocaleDateString("pt-BR", options);
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get<Evento[]>(
          "http://localhost:3000/api/eventos/"
        );
        setEventos(response.data);
        setEventosFiltrados(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  useEffect(() => {
    let filtrados = eventos;

    if (filtroData) {
      filtrados = filtrados.filter(
        (ev) => ev.Data_Evento.split("T")[0] === filtroData
      );
    }

    if (busca.trim()) {
      const buscaNormalizada = normalizarTexto(busca);
      filtrados = filtrados.filter(
        (ev) =>
          normalizarTexto(ev.Nome_Evento).includes(buscaNormalizada) ||
          normalizarTexto(ev.Local_Evento).includes(buscaNormalizada)
      );
    }

    setEventosFiltrados(filtrados);
  }, [filtroData, busca, eventos]);

  useEffect(() => {
    const atualizarHora = () => {
      const horaAtual = new Date().getHours();
      if (horaAtual >= 5 && horaAtual <= 20) {
        setHoraAtualIndex(horaAtual - 5);
      } else {
        setHoraAtualIndex(null);
      }
    };

    atualizarHora();
    const intervalo = setInterval(atualizarHora, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const renderCalendarView = () => {
    if (filtroData) {
      return (
        <TimelineView
          dias={getDaysForTimelineView()}
          horas={horas}
          eventosFiltrados={eventosFiltrados}
        />
      );
    }

    switch (view) {
      case "daily":
      case "weekly":
        return (
          <TimelineView
            dias={getDaysForTimelineView()}
            horas={horas}
            eventosFiltrados={eventosFiltrados}
          />
        );
      case "monthly":
        return (
          <MonthlyGridView
            currentDate={currentDate}
            eventos={eventosFiltrados}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="calendar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar evento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <button
          onClick={() => {
            setFiltroData("");
            setBusca("");
          }}
        >
          Limpar
        </button>
      </div>

      <div className="calendar-controls">
        <div className="navigation-controls">
          <button onClick={handlePrev}>&lt; Ant</button>
          <button onClick={handleToday}>Hoje</button>
          <button onClick={handleNext}>Próx &gt;</button>
        </div>

        <div className="current-view-label">
          <h2>{getViewTitle()}</h2>
        </div>

        <div className="view-controls">
          <button
            className={view === "daily" && !filtroData ? "active" : ""}
            onClick={() => {
              setView("daily");
              setFiltroData("");
            }}
          >
            Diário
          </button>
          <button
            className={view === "weekly" && !filtroData ? "active" : ""}
            onClick={() => {
              setView("weekly");
              setFiltroData("");
            }}
          >
            Semanal
          </button>
          <button
            className={view === "monthly" && !filtroData ? "active" : ""}
            onClick={() => {
              setView("monthly");
              setFiltroData("");
            }}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="calendar-view-area">{renderCalendarView()}</div>
    </div>
  );
};

interface TimelineViewProps {
  dias: DiaSemana[];
  horas: string[];
  eventosFiltrados: Evento[];
}

const TimelineView = ({ dias, horas, eventosFiltrados }: TimelineViewProps) => {
  return (
    <div className="calendar-scroll-container">
      <table className="calendar-table">
        <thead>
          <tr className="header-row">
            <th className="hour-header"></th>
            {dias.map((dia) => (
              <th
                key={`header-${dia.data}`}
                className={`day-header ${dia.isToday ? "today" : ""}`}
              >
                <div className="day-number">{dia.numero}</div>
                <div className="day-name">{dia.nome}</div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="calendar-body-row">
            <td className="hour-labels-cell">
              {horas.map((hora) => (
                <div className="hour-label-item" key={hora}>
                  <span>{hora}:00</span>
                </div>
              ))}
            </td>

            {dias.map((dia) => {
              const eventosDoDia = eventosFiltrados.filter(
                (ev) => formatarDataLocal(new Date(ev.Data_Evento)) === dia.data
              );

              return (
                <td
                  key={`cell-${dia.data}`}
                  className={`event-cell ${dia.isToday ? "today-column" : ""}`}
                >
                  {horas.map((hora) => (
                    <div
                      className="hour-background-line"
                      key={`line-${dia.data}-${hora}`}
                    ></div>
                  ))}

                  {eventosDoDia.map((ev) => {
                    const duracaoEmHoras = parseFloat(
                      String(ev.Duracao_Evento).replace(",", ".")
                    );
                    const duracaoValidaHoras = isNaN(duracaoEmHoras)
                      ? 0
                      : duracaoEmHoras;
                    const duracaoTotalMinutos = duracaoValidaHoras * 60;
                    const dataEvento = new Date(ev.Data_Evento);
                    const startHour = dataEvento.getHours();
                    const startMinute = dataEvento.getMinutes();
                    const totalStartMinutes = startHour * 60 + startMinute;
                    const calendarStartMinutes = 5 * 60;
                    const topOffset = Math.max(
                      0,
                      totalStartMinutes - calendarStartMinutes
                    );
                    const eventHeight = duracaoTotalMinutos;
                    const dataFim = new Date(
                      dataEvento.getTime() + duracaoTotalMinutos * 60000
                    );
                    const style = {
                      top: `${topOffset}px`,
                      height: `${eventHeight}px`,
                    };
                    const horaInicioStr = dataEvento.toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    const horaFimStr = !isNaN(dataFim.getTime())
                      ? dataFim.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "??";

                    return (
                      <div
                        key={ev.ID_Evento}
                        className="event-card"
                        style={style}
                      >
                        <strong className="title">{ev.Nome_Evento}</strong>
                        <p>{ev.Local_Evento}</p>
                        <small className="time">{`${horaInicioStr} - ${horaFimStr}`}</small>
                      </div>
                    );
                  })}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface MonthlyGridViewProps {
  currentDate: Date;
  eventos: Evento[];
}

const MonthlyGridView = ({ currentDate, eventos }: MonthlyGridViewProps) => {
  const [gridDays, setGridDays] = useState<GridDay[]>([]);
  const weekDayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  useEffect(() => {
    const buildMonthGrid = () => {
      const today = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const firstDayWeekday = firstDayOfMonth.getDay();

      const days: GridDay[] = [];

      const prevLastDay = new Date(year, month, 0);
      const prevMonthDays = prevLastDay.getDate();
      for (let i = firstDayWeekday; i > 0; i--) {
        const day = prevMonthDays - i + 1;
        const date = new Date(year, month - 1, day, 12);
        days.push({
          date: date,
          dayOfMonth: day,
          isCurrentMonth: false,
          isToday: false,
          dateString: formatarDataLocal(date),
        });
      }

      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(year, month, i, 12);
        const isToday = formatarDataLocal(date) === formatarDataLocal(today);
        days.push({
          date: date,
          dayOfMonth: i,
          isCurrentMonth: true,
          isToday: isToday,
          dateString: formatarDataLocal(date),
        });
      }

      const lastDayWeekday = lastDayOfMonth.getDay();
      const daysToAdd = 6 - lastDayWeekday;
      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(year, month + 1, i, 12);
        days.push({
          date: date,
          dayOfMonth: i,
          isCurrentMonth: false,
          isToday: false,
          dateString: formatarDataLocal(date),
        });
      }

      let nextDay = days[days.length - 1].dayOfMonth + 1;
      while (days.length < 42) {
        const date = new Date(year, month + 1, nextDay, 12);
        days.push({
          date: date,
          dayOfMonth: nextDay,
          isCurrentMonth: false,
          isToday: false,
          dateString: formatarDataLocal(date),
        });
        nextDay++;
      }

      setGridDays(days);
    };

    buildMonthGrid();
  }, [currentDate]);

  return (
    <div className="monthly-grid-container">
      <div className="monthly-grid-header">
        {weekDayNames.map((name) => (
          <div key={name} className="grid-header-cell">
            {name}
          </div>
        ))}
      </div>

      <div className="monthly-grid-body">
        {gridDays.map((day) => {
          const eventosDoDia = eventos.filter(
            (ev) =>
              formatarDataLocal(new Date(ev.Data_Evento)) === day.dateString
          );

          return (
            <div
              key={day.dateString}
              className={`grid-day-cell ${
                day.isCurrentMonth ? "" : "not-current-month"
              } ${day.isToday ? "today" : ""}`}
            >
              <div className="day-number">{day.dayOfMonth}</div>
              <div className="day-events">
                {eventosDoDia.map((ev) => (
                  <div key={ev.ID_Evento} className="event-chip">
                    {ev.Nome_Evento}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
