import { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/calendar.css";
import { normalizarTexto } from "../../../utils/formatacoes";
import { ModalCadastroTarefa } from "../../../components/modals/ModalCadastroTarefa";
import { useAuth } from "../../../context/AuthContext";

interface DiaSemana {
  numero: number;
  nome: string;
  data: string;
  isToday: boolean;
}

interface Tarefa {
  ID_Agenda: number;
  Titulo: string;
  Data_Hora_Inicio: string;
  Data_Hora_Fim: string | null;
  Prioridade: string;
  Nome_Cliente: string | null;
}

export const Calendar = () => {
  const { user } = useAuth();
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefasFiltradas, setTarefasFiltradas] = useState<Tarefa[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

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

  const carregarTarefas = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/agenda/vendedor/${user.id}`
      );
      setTarefas(response.data);
    } catch {
      setTarefas([]);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, [user]);

  useEffect(() => {
    let filtrados = tarefas;
    
    if (filtroData) {
      filtrados = filtrados.filter(
        (t) => t.Data_Hora_Inicio.split("T")[0] === filtroData
      );
    }
    
    if (busca.trim()) {
      const buscaNorm = normalizarTexto(busca);
      filtrados = filtrados.filter(
        (t) =>
          normalizarTexto(t.Titulo).includes(buscaNorm) ||
          normalizarTexto(t.Nome_Cliente || "").includes(buscaNorm)
      );
    }
    setTarefasFiltradas(filtrados);
  }, [filtroData, busca, tarefas]);

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

  const prioridadeClass = (prio: string) => {
    const p = (prio || "").toLowerCase();
    if (p.includes("baixa")) return "prio-baixa";
    if (p.includes("média") || p.includes("media")) return "prio-media";
    if (p.includes("alta")) return "prio-alta";
    if (p.includes("urgente")) return "prio-urgente";
    return "prio-media";
  };

  return (
    <div id="divEventos" className="calendar-container">
      <div className="search-bar">
        <button onClick={() => setModalAberto(true)}>+ Novo Lembrete</button>
        <input
          type="text"
          placeholder="Buscar lembrete ou cliente..."
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
              const tarefasDoDia = tarefasFiltradas.filter(
                (t) =>
                  formatarDataLocal(new Date(t.Data_Hora_Inicio)) === dia.data
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
                  
                  {tarefasDoDia.map((t) => {
                    const inicio = new Date(t.Data_Hora_Inicio);
                    const fim = t.Data_Hora_Fim
                      ? new Date(t.Data_Hora_Fim)
                      : new Date(inicio.getTime() + 60 * 60 * 1000);

                    const totalStartMinutes = inicio.getHours() * 60 + inicio.getMinutes();
                    const totalEndMinutes = fim.getHours() * 60 + fim.getMinutes();

                    const topOffset = totalStartMinutes - 5 * 60;
                    const eventHeight = totalEndMinutes - totalStartMinutes;

                    const style = {
                      top: `${Math.max(0, topOffset)}px`,
                      height: `${Math.max(24, eventHeight)}px`,
                    };
                    
                    const prioridade = prioridadeClass(t.Prioridade || "");
                    const horaInicioStr = inicio.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={t.ID_Agenda}
                        className={`event-card ${prioridade}`}
                        style={style}
                      >
                        <strong className="title">{t.Titulo}</strong>
                        {t.Nome_Cliente && (
                          <p className="client-name">{t.Nome_Cliente}</p>
                        )}
                        <small className="time">{horaInicioStr}</small>
                      </div>
                    );
                  })}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      <ModalCadastroTarefa
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onTarefaCriada={carregarTarefas}
      />
    </div>
  );
};