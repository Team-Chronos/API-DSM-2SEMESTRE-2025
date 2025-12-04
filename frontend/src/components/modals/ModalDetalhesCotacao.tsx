import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../services/api";
import { FaMapMarkerAlt, FaUser, FaSync, FaBoxes, FaDollarSign, FaCalendarAlt, FaRoute, FaTruck } from 'react-icons/fa';
import "../../css/detalhesCotacao.css";

interface CotacaoDetalhes {
  id: number;
  origem_uf: string;
  origem_cidade: string;
  destino_uf: string;
  destino_cidade: string;
  remetente: string;
  peso_carga: number;
  valor_carga: number;
  tipo_carga: string;
  pedagio: number;
  distancia_km: number;
  veiculo_id: number;
  drop_servico: boolean;
  status: string;
  imposto: number;
  total: number;
  custo: number;
  frete: number;
  liquido: number;
  margem: number;
  criado_em: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  cotacaoId: number | null;
  onAtualizar: () => void;
}

export function ModalDetalhesCotacao({ show, onClose, cotacaoId, onAtualizar }: Props) {
  const [cotacao, setCotacao] = useState<CotacaoDetalhes | null>(null);
  const [remetenteEditado, setRemetenteEditado] = useState<string>("");
  const [statusSelecionado, setStatusSelecionado] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && cotacaoId) {
      carregarDados();
    }
  }, [show, cotacaoId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resCotacao = await api.get(`/cotacao/${cotacaoId}`);

      console.log("Dados da cotação individual:", resCotacao.data);

      setCotacao(resCotacao.data);
      setRemetenteEditado(resCotacao.data.remetente || "");
      setStatusSelecionado(resCotacao.data.status || "ABERTA");
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      alert("Erro ao carregar detalhes da cotação");
    } finally {
      setLoading(false);
    }
  };


  const handleSalvar = async () => {
    if (!remetenteEditado.trim()) {
      alert("Digite o nome do remetente.");
      return;
    }

    try {
      await api.put(`/cotacao/${cotacaoId}`, {
        remetente: remetenteEditado,
        status: statusSelecionado,
      });

      alert("Cotação atualizada com sucesso!");
      onAtualizar();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar cotação:", err);
      alert("Erro ao atualizar cotação.");
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta cotação?")) return;

    try {
      await api.delete(`/cotacao/${cotacaoId}`);
      alert("Cotação excluída com sucesso!");
      onAtualizar();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir cotação:", err);
      alert("Erro ao excluir cotação.");
    }
  };

  const formatarValor = (valor: number) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (dataString: string) => {
    console.log("Data recebida:", dataString);

    if (!dataString || dataString === "0000-00-00 00:00:00") return "N/A";

    try {
      const data = new Date(dataString.replace(' ', 'T'));

      if (isNaN(data.getTime())) {
        return "Data inválida";
      }

      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.error("Erro ao formatar data:", err);
      return "Erro na data";
    }
  };


  const getStatusClass = (status: string) => {
    switch (status) {
      case "APROVADA": return "status-aprovada";
      case "FINALIZADA": return "status-finalizada";
      case "CANCELADA": return "status-cancelada";
      default: return "status-aberta";
    }
  };

  if (loading || !cotacao) {
    return (
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando detalhes...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable className="modal-detalhes-cotacao">
      <Modal.Header closeButton>
        <Modal.Title className="detalhes-titulo">
          <FaTruck className="me-2" />
          Cotação #{cotacao.id}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="detalhes-body">
        <div className={`status-badge ${getStatusClass(statusSelecionado)}`}>
          {statusSelecionado}
        </div>

        <section className="detalhes-section">
          <div className="section-header">
            <FaRoute className="section-icon" />
            <h5>Informações da Rota</h5>
          </div>
          <div className="rota-card">
            <div className="rota-item origem">
              <FaMapMarkerAlt className="marker-icon" />
              <div>
                <span className="rota-label">Origem</span>
                <span className="rota-valor">{cotacao.origem_cidade}/{cotacao.origem_uf}</span>
              </div>
            </div>
            <div className="rota-separador">
              <div className="linha"></div>
              <span className="distancia-badge">{cotacao.distancia_km} km</span>
              <div className="linha"></div>
            </div>
            <div className="rota-item destino">
              <FaMapMarkerAlt className="marker-icon" />
              <div>
                <span className="rota-label">Destino</span>
                <span className="rota-valor">{cotacao.destino_cidade}/{cotacao.destino_uf}</span>
              </div>
            </div>
          </div>
          <div className="data-criacao">
            <FaCalendarAlt className="me-2" />
            Criada em {formatarData(cotacao.criado_em)}
          </div>
        </section>

        <section className="detalhes-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h5>Remetente</h5>
          </div>
          <div className="input-card">
            <Form.Control
              type="text"
              placeholder="Nome do remetente"
              value={remetenteEditado}
              onChange={(e) => setRemetenteEditado(e.target.value)}
              className="input-estilizado"
            />
          </div>
        </section>

        <section className="detalhes-section">
          <div className="section-header">
            <FaSync className="section-icon" />
            <h5>Status da Cotação</h5>
          </div>
          <div className="input-card">
            <Form.Select
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
              className="select-estilizado"
            >
              <option value="ABERTA">Aberta</option>
              <option value="APROVADA">Aprovada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="FINALIZADA">Finalizada</option>
            </Form.Select>
          </div>
        </section>

        <section className="detalhes-section">
          <div className="section-header">
            <FaBoxes className="section-icon" />
            <h5>Informações da Carga</h5>
          </div>
          <div className="info-grid-detalhes">
            <div className="info-card-item">
              <span className="info-card-label">Peso</span>
              <span className="info-card-valor">{cotacao.peso_carga} kg</span>
            </div>
            <div className="info-card-item">
              <span className="info-card-label">Valor da Carga</span>
              <span className="info-card-valor">{formatarValor(cotacao.valor_carga)}</span>
            </div>
            <div className="info-card-item">
              <span className="info-card-label">Tipo</span>
              <span className="info-card-valor">{cotacao.tipo_carga || "N/A"}</span>
            </div>
            <div className="info-card-item">
              <span className="info-card-label">Serviço DROP</span>
              <span className={`badge-drop ${cotacao.drop_servico ? 'drop-sim' : 'drop-nao'}`}>
                {cotacao.drop_servico ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </section>

        <section className="detalhes-section">
          <div className="section-header">
            <FaDollarSign className="section-icon" />
            <h5>Detalhamento Financeiro</h5>
          </div>
          <div className="valores-detalhados">
            <div className="valor-linha">
              <span className="valor-label">Frete Base</span>
              <span className="valor-numero">{formatarValor(cotacao.frete)}</span>
            </div>
            <div className="valor-linha">
              <span className="valor-label">Pedágio</span>
              <span className="valor-numero">{formatarValor(cotacao.pedagio)}</span>
            </div>
            <div className="valor-linha">
              <span className="valor-label">Impostos e Taxas</span>
              <span className="valor-numero">{formatarValor(cotacao.imposto)}</span>
            </div>
            <div className="valor-linha subtotal">
              <span className="valor-label">Custo Total</span>
              <span className="valor-numero">{formatarValor(cotacao.custo)}</span>
            </div>
          </div>

          <div className="resumo-financeiro">
            <div className="resumo-item total">
              <span className="resumo-label">Total do Frete</span>
              <span className="resumo-valor">{formatarValor(cotacao.total)}</span>
            </div>
            <div className="resumo-item liquido">
              <span className="resumo-label">Valor Líquido</span>
              <span className="resumo-valor">{formatarValor(cotacao.liquido)}</span>
            </div>
            <div className="resumo-item margem">
              <span className="resumo-label">Margem de Lucro</span>
              <span className="resumo-valor">{(cotacao.margem * 100).toFixed(2)}%</span>
            </div>
          </div>
        </section>
      </Modal.Body>

      <Modal.Footer className="detalhes-footer">
        <Button variant="danger" onClick={handleExcluir} className="btn-excluir">
          Excluir Cotação
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleSalvar} className="btn-salvar">
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
