import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Tarefa } from "../../pages/home/eventos/Calendar";
import api from "../../services/api";
import { Navigate } from "react-router-dom";

interface ModalCadastroTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada: () => void;
  tarefaParaEditar: Tarefa | null;
}

const SETOR_COMERCIAL = 2;

const formatForMySQL = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatInputDate = (isoDate: string) => {
  return isoDate.split("T")[0];
};

const formatInputTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


export const ModalCadastroTarefa = ({
  isOpen,
  onClose,
  onTarefaCriada,
  tarefaParaEditar,
}: ModalCadastroTarefaProps) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to={"/login"} replace />

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [clientes, setClientes] = useState<any[]>([]);
  const [idCliente, setIdCliente] = useState("");

  const isComercial = user?.setor === SETOR_COMERCIAL;
  const isEditMode = tarefaParaEditar !== null;

  useEffect(() => {
    if (isComercial && user?.id) {
      api
        .get(`/clientes/dropdown/${user.id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setClientes(res.data);
          } else {
            setClientes([]);
          }
        })
        .catch(() => {
          setClientes([]);
        });
    }
  }, [user, isComercial]);

  useEffect(() => {
    if (isEditMode && tarefaParaEditar) {
      setTitulo(tarefaParaEditar.Titulo);
      setDescricao(tarefaParaEditar.Descricao || "");
      setData(formatInputDate(tarefaParaEditar.Data_Hora_Inicio));
      setHora(formatInputTime(tarefaParaEditar.Data_Hora_Inicio));
      setLocal(tarefaParaEditar.Local_Evento || "");
      setPrioridade(tarefaParaEditar.Prioridade || "Média");
      setIdCliente(tarefaParaEditar.ID_Cliente?.toString() || "");
    } else {
      limparForm();
    }
  }, [tarefaParaEditar, isEditMode]);

  const limparForm = () => {
    setTitulo("");
    setDescricao("");
    setData("");
    setHora("09:00");
    setLocal("");
    setPrioridade("Média");
    setIdCliente("");
  };

  const handleSalvar = async () => {
    if (!titulo.trim() || !data || !hora) return;

    try {
      const dataHoraInicio = new Date(`${data}T${hora}`);
      const dataHoraFim = new Date(dataHoraInicio.getTime() + 60 * 60 * 1000);

      const payload = {
        ID_Colaborador: user.id,
        Titulo: titulo,
        Descricao: descricao || null,
        Data_Hora_Inicio: formatForMySQL(dataHoraInicio),
        Data_Hora_Fim: formatForMySQL(dataHoraFim),
        Local_Evento: local || null,
        Prioridade: prioridade,
        Tipo_Contato: null,
        ID_Cliente: isComercial && idCliente ? idCliente : null,
      };

      if (isEditMode && tarefaParaEditar) {
        await api.put(`/agenda/${tarefaParaEditar.ID_Agenda}`, payload);
      } else {
        await api.post("/agenda", payload);
      }

      limparForm();
      onTarefaCriada();
      onClose();

    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
    }
  };

  const handleCancelar = () => {
    limparForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancelar}>
      <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? "Editar Lembrete" : "Novo Lembrete"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSalvar();
          }}
        >
          <label>Título*</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 2 }}>
              <label>Data*</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Hora*</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
          </div>

          <label>Local</label>
          <input value={local} onChange={(e) => setLocal(e.target.value)} />
          <label>Prioridade</label>
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
            <option>Urgente</option>
          </select>

          {isComercial && (
            <>
              <label>Cliente</label>
              <select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.ID_Cliente} value={c.ID_Cliente}>
                    {c.Nome_Cliente}
                  </option>
                ))}
              </select>
            </>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              {isEditMode ? "Salvar Alterações" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};