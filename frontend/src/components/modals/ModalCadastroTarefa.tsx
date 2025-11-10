import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface ModalCadastroTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada: () => void;
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

export const ModalCadastroTarefa = ({
  isOpen,
  onClose,
  onTarefaCriada,
}: ModalCadastroTarefaProps) => {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [tipoContato, setTipoContato] = useState("Reunião");
  const [clientes, setClientes] = useState<any[]>([]);
  const [idCliente, setIdCliente] = useState("");

  const isComercial = user?.setor === SETOR_COMERCIAL;

  useEffect(() => {
    if (isComercial && user?.id) {
      axios
        .get(`http://localhost:3000/api/clientes/dropdown/${user.id}`)
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

  const limparForm = () => {
    setTitulo("");
    setDescricao("");
    setData("");
    setHora("09:00");
    setLocal("");
    setPrioridade("Média");
    setTipoContato("Reunião");
    setIdCliente("");
  };

  const handleSalvar = async () => {
    if (!titulo.trim() || !data || !hora) return;

    try {
      const dataHoraInicio = new Date(`${data}T${hora}`);
      const dataHoraFim = new Date(dataHoraInicio.getTime() + 60 * 60 * 1000);

      await axios.post("http://localhost:3000/api/agenda", {
        ID_Colaborador: user.id,
        Titulo: titulo,
        Descricao: descricao,
        Data_Hora_Inicio: formatForMySQL(dataHoraInicio),
        Data_Hora_Fim: formatForMySQL(dataHoraFim),
        Local_Evento: local || null,
        Prioridade: prioridade,
        Tipo_Contato: tipoContato,
        ID_Cliente: isComercial ? idCliente || null : null,
      });

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
        <h2>Novo Lembrete</h2>
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
          <label>Tipo de Contato</label>
          <select
            value={tipoContato}
            onChange={(e) => setTipoContato(e.target.value)}
          >
            <option>Email</option>
            <option>Telefone</option>
            <option>Reunião</option>
            <option>Visita</option>
            <option>Proposta</option>
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};