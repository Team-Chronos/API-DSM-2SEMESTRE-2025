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

export const Calendar = () => {
  const [busca, setBusca] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [, setHoraAtualIndex] = useState<number | null>(null);

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

  const getCurrentWeekDays = (): DiaSemana[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate());

    const weekDays: DiaSemana[] = [];
    for (let i = 0; i < 5; i++) {
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

  const horas = Array.from({ length: 16 }, (_, i) =>
    (5 + i).toString().padStart(2, "0")
  );

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
      filtrados = filtrados.filter(
        (ev) =>
          normalizarTexto(ev.Nome_Evento).includes(busca) ||
          normalizarTexto(ev.Local_Evento).includes(busca)
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

  const dias: DiaSemana[] = filtroData
    ? [
        {
          numero: new Date(filtroData + "T00:00:00").getDate(),
          nome: getDayName(new Date(filtroData + "T00:00:00").getDay()),
          data: filtroData,
          isToday: formatarDataLocal(new Date()) === filtroData,
        },
      ]
    : getCurrentWeekDays();

  return (
    <div className="calendar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar evento..."
          value={busca}
          onChange={(e) => setBusca(normalizarTexto(e.target.value))}
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

      <table className="calendar-table">
        <thead>
          <tr className="header-row">
            <th className="hour-header"></th>
            {dias.map((dia) => (
              <th
                key={`header-${dia.numero}`}
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
                  key={`cell-${dia.numero}`}
                  className={`event-cell ${dia.isToday ? "today-column" : ""}`}
                >
                  {horas.map((hora) => (
                    <div
                      className="hour-background-line"
                      key={`line-${dia.numero}-${hora}`}
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

                    const topOffset = totalStartMinutes - calendarStartMinutes;
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
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
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
