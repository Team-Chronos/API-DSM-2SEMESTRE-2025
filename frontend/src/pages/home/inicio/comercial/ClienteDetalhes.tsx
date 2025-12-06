import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatarTelefone } from "../../../../utils/formatacoes";
import { useAuth } from "../../../../context/AuthContext";
import "../../../../css/clienteDetalhes.css";
import api from "../../../../services/api";

interface Cliente {
  ID_Cliente: number;
  Nome_Cliente: string;
  Email_Cliente: string;
  Telefone_Cliente: string;
  Segmento: string;
  atividade: string;
  depart_responsavel: string;
  Etapa?: string;
}

interface Interacao {
  ID_Interacao: number;
  ID_Cliente: number;
  ID_Colaborador: number | null;
  Data_Interacao: string;
  Tipo_Interacao: string;
  Descricao: string;
  Resultado: string;
  Nome_Cliente?: string;
  Nome_Col?: string;
}

export const ClienteDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    Tipo_Interacao: "Telefone",
    Descricao: "",
    Resultado: "",
  });

  const carregarCliente = async () => {
    try {
      const res = await api.get(`/clientes/${id}`);
      setCliente(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarInteracoes = async () => {
    try {
      const res = await api.get(`/interacoes/cliente/${id}`);
      setInteracoes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/interacoes", {
        ...form,
        ID_Cliente: Number(id),
        ID_Colaborador: user?.id,
        data_interacao: new Date().toISOString().slice(0, 19).replace("T", " ")
      });

      setShowModal(false);
      setForm({
        Tipo_Interacao: "Telefone",
        Descricao: "",
        Resultado: "",
      });
      carregarInteracoes();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar interação");
    }
  };

  useEffect(() => {
    carregarCliente();
    carregarInteracoes();
  }, [id]);

  const getEtapaClass = (etapa: string = "INICIAL") => {
    const etapaLower = etapa.toLowerCase();
    if (etapaLower.includes("prospec")) return "etapa-prospeccao";
    if (etapaLower.includes("negoc")) return "etapa-negociacao";
    if (etapaLower.includes("fechado") || etapaLower.includes("ganho")) return "etapa-fechado";
    if (etapaLower.includes("perdido")) return "etapa-perdido";
    return "etapa-inicial";
  };

  if (loading) {
    return (
      <div className="cliente-detalhes-loading">
        <div className="loading-spinner"></div>
        <p>Carregando informações...</p>
      </div>
    );
  }

  if (!cliente) {
    return <div className="cliente-detalhes-error">Cliente não encontrado</div>;
  }

  const etapaAtual = cliente.Etapa || "INICIAL";

  return (
    <div className="cliente-detalhes-page">
      <div className="cliente-detalhes-content">
        <div className="interacoes-section">
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            &larr; Voltar para dashboard
          </button>
          
          <h2 className="section-title">Histórico de Interações</h2>
          
          <div className="interacoes-lista-wrapper">
  <div className="interacoes-lista">
    {interacoes.length === 0 ? (
      <div className="sem-interacoes">
        <p>Nenhuma interação registrada ainda.</p>
      </div>
    ) : (
      interacoes.map((inter) => (
        <div className="interacao-card" key={inter.ID_Interacao}>
          <div className="interacao-content">
            <div className="interacao-tipo-titulo">{inter.Tipo_Interacao}</div>
            <div className="interacao-descricao">{inter.Descricao}</div>
          </div>
          <div className="interacao-data">
            {new Date(inter.Data_Interacao).toLocaleDateString("pt-BR")} 
            <br />
            {new Date(inter.Data_Interacao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      ))
    )}
  </div>
</div>

        </div>

        <div className="info-section">
          <div className="info-card">
            <div className="info-header">
              <div className="info-icon">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="info-title-group">
                <h3 className="info-title">{cliente.Nome_Cliente}</h3>
                <div className="info-subtitle">{cliente.Segmento}</div>
              </div>
            </div>

            <div className="info-body">
              <div className="info-item">
                <span className="info-label">ETAPA:</span>
                <span className={`etapa-badge ${getEtapaClass(etapaAtual)}`}>
                  {etapaAtual}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">EMAIL:</span>
                <span className="info-value">{cliente.Email_Cliente}</span>
              </div>
              <div className="info-item">
                <span className="info-label">TELEFONE:</span>
                <span className="info-value">{formatarTelefone(cliente.Telefone_Cliente)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ATIVIDADE:</span>
                <span className="info-value">{cliente.atividade}</span>
              </div>
              <div className="info-item">
                <span className="info-label">DEPARTAMENTO:</span>
                <span className="info-value">{cliente.depart_responsavel}</span>
              </div>
            </div>
          </div>

          <button className="btn-add-interacao" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg"></i> Nova Interação
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-interacao" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nova Interação</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="Tipo_Interacao">Tipo de Interação</label>
                  <select
                    id="Tipo_Interacao"
                    name="Tipo_Interacao"
                    value={form.Tipo_Interacao}
                    onChange={handleChange}
                    required
                  >
                    <option value="Telefone">Telefone</option>
                    <option value="Email">Email</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Visita">Visita</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Proposta">Proposta</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Descricao">Descrição</label>
                  <textarea
                    id="Descricao"
                    name="Descricao"
                    value={form.Descricao}
                    onChange={handleChange}
                    placeholder="Descreva brevemente a interação..."
                    rows={3}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Resultado">Resultado</label>
                  <input
                    id="Resultado"
                    type="text"
                    name="Resultado"
                    value={form.Resultado}
                    onChange={handleChange}
                    placeholder="Resultado do contato"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
