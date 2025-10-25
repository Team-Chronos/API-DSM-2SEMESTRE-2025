import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/calendar.css";

export const Eventos = () => {
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [linhaAtualTop, setLinhaAtualTop] = useState<number | null>(null);

  
  const formatarDataLocal = (date: Date) => {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`; 
  };

  const getDayName = (dayIndex: number) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[dayIndex];
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const isToday = formatarDataLocal(currentDate) === formatarDataLocal(today);

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
        const response = await axios.get("http://localhost:3000/eventos");
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

    setEventosFiltrados(filtrados);
  }, [filtroData, eventos]);

  
  useEffect(() => {
    const atualizarPosicao = () => {
      const agora = new Date();
      const hora = agora.getHours();
      const minuto = agora.getMinutes();

      if (hora >= 5 && hora <= 20) {
        const rowHeight = 60;
        const horaIndex = hora - 5;
        const top = horaIndex * rowHeight + (minuto / 60) * rowHeight;
        setLinhaAtualTop(top);
      } else {
        setLinhaAtualTop(null);
      }
    };

    atualizarPosicao();
    const intervalo = setInterval(atualizarPosicao, 60000);
    return () => clearInterval(intervalo);
  }, []);

  
  const dias = filtroData
    ? [
        {
          numero: new Date(filtroData + "T00:00:00").getDate(),
          nome: getDayName(new Date(filtroData + "T00:00:00").getDay()),
          data: filtroData,
          isToday:
            formatarDataLocal(new Date(filtroData + "T00:00:00")) ===
            formatarDataLocal(new Date()),
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
          onChange={(e) => setBusca(e.target.value)}
        />

        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <button onClick={() => setFiltroData("")}>Limpar Filtro</button>
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
          {horas.map((hora, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="event-row">
              <td className="hour-cell">
                <span>{hora}:00</span>
              </td>
              {dias.map((dia) => {
                const eventosDoDiaHora = eventosFiltrados.filter((ev) => {
                  const dataEvento = new Date(ev.Data_Evento);
                  const horaEvento = dataEvento
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                  return (
                    formatarDataLocal(dataEvento) === dia.data &&
                    horaEvento === hora
                  );
                });

                return (
                  <td
                    key={`cell-${dia.numero}-${rowIndex}`}
                    className={`event-cell ${dia.isToday ? "today-column" : ""}`}
                  >
                    {eventosDoDiaHora.map((ev) => (
                      <div key={ev.ID_Evento} className="event-card">
                        <strong>{ev.Nome_Evento}</strong>
                        <p>{ev.Local_Evento}</p>
                        <small>{ev.Duracao_Evento}</small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {linhaAtualTop !== null && (
        <div
          className="linha-horario-atual"
          style={{ top: `${linhaAtualTop - 18}px` }}
        ></div>
      )}
    </div>
  );
};
