import { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Evento {
  ID_Evento: number;
  Nome_Evento: string;
  Data_Evento: string;
  Duracao_Evento: number;
  Local_Evento: string;
  Descricao: string;
}

interface EventosCalendarProps {
  eventos: Evento[];
}

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const EventosCalendar = ({ eventos }: EventosCalendarProps) => {
  const eventosFormatados = useMemo(() => {
    return eventos.map((ev) => {
      const inicio = new Date(ev.Data_Evento);
      const duracaoHoras = Number(ev.Duracao_Evento) || 1;
      const fim = new Date(inicio.getTime() + duracaoHoras * 60 * 60 * 1000);

      return {
        id: ev.ID_Evento,
        title: ev.Nome_Evento,
        start: inicio,
        end: fim,
        allDay: false,
      };
    });
  }, [eventos]);

  return (
    <div style={{ height: "75vh", padding: 10 }}>
      <h4 className="mb-3">📅 Calendário de Eventos</h4>
      <Calendar
        localizer={localizer}
        events={eventosFormatados}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
};
