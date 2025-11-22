import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { FaMapMarkerAlt, FaUser, FaSync, FaBoxes, FaDollarSign, FaCalendarAlt, FaRoute } from 'react-icons/fa';

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
  created_at: string;
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

      const resCotacao = await axios.get(`http://localhost:3000/api/cotacao/${cotacaoId}`);
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
      await axios.put(`http://localhost:3000/api/cotacao/${cotacaoId}`, {
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
      await axios.delete(`http://localhost:3000/api/cotacao/${cotacaoId}`);
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
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading || !cotacao) {
    return (
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Body className="text-center py-5">
          <p>Carregando...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Cotação #{cotacao.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <section className="mb-4">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FaRoute /> Rota
            </h5>
            <div className="info-grid">
              <div>
                <strong>Origem:</strong> {cotacao.origem_cidade}/{cotacao.origem_uf}
              </div>
              <div>
                <strong>Destino:</strong> {cotacao.destino_cidade}/{cotacao.destino_uf}
              </div>
              <div>
                <strong>Distância:</strong> {cotacao.distancia_km} km
              </div>
              <div>
                <strong>Data:</strong> {formatarData(cotacao.created_at)}
              </div>
            </div>
          </section>

          <hr />

          <section className="mb-4">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FaUser /> Remetente (Cliente)
            </h5>
            <Form.Control
              type="text"
              placeholder="Nome do remetente"
              value={remetenteEditado}
              onChange={(e) => setRemetenteEditado(e.target.value)}
            />
          </section>

          <hr />

          <section className="mb-4">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FaSync /> Status
            </h5>
            <Form.Select
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
            >
              <option value="ABERTA">Aberta</option>
              <option value="APROVADA">Aprovada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="FINALIZADA">Finalizada</option>
            </Form.Select>
          </section>

          <hr />

          <section className="mb-4">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FaBoxes /> Carga
            </h5>
            <div className="info-grid">
              <div>
                <strong>Peso:</strong> {cotacao.peso_carga} kg
              </div>
              <div>
                <strong>Valor:</strong> {formatarValor(cotacao.valor_carga)}
              </div>
              <div>
                <strong>Tipo:</strong> {cotacao.tipo_carga || "N/A"}
              </div>
              <div>
                <strong>DROP:</strong> {cotacao.drop_servico ? "Sim" : "Não"}
              </div>
            </div>
          </section>

          <hr />

          <section className="mb-4">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FaDollarSign /> Valores
            </h5>
            <div className="info-grid">
              <div>
                <strong>Frete:</strong> {formatarValor(cotacao.frete)}
              </div>
              <div>
                <strong>Pedágio:</strong> {formatarValor(cotacao.pedagio)}
              </div>
              <div>
                <strong>Imposto:</strong> {formatarValor(cotacao.imposto)}
              </div>
              <div>
                <strong>Custo Total:</strong> {formatarValor(cotacao.custo)}
              </div>
            </div>
            <div className="mt-3 p-3 bg-light rounded">
              <div className="d-flex justify-content-between">
                <strong>Total do Frete:</strong>
                <span className="text-success fs-5 fw-bold">{formatarValor(cotacao.total)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Valor Líquido:</strong>
                <span className="text-primary">{formatarValor(cotacao.liquido)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Margem:</strong>
                <span>{(cotacao.margem * 100).toFixed(2)}%</span>
              </div>
            </div>
          </section>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleExcluir}>
          Excluir Cotação
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleSalvar}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
