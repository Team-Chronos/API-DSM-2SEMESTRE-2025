import { Modal, Button, Accordion, Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistVeiFrota({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);

  async function carregarChecklist() {
    try {
      const resposta = await api.get(`/checklistVeiculoFrota/${idChecklist}`);
      setChecklist(resposta.data);
    } catch (err) {
      console.error("Erro ao carregar checklist:", err);
    }
  }

  useEffect(() => {
    if (idChecklist && show) {
      carregarChecklist();
    }
  }, [idChecklist, show]);

  if (!checklist) return null;

  const normalizar = (txt: string) => txt?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const temProblema = (valor: string) => normalizar(valor) === 'nao';

  const renderItem = (label: string, valor: string) => {
    const isProblem = temProblema(valor);
    return (
      <div className="mb-2 d-flex justify-content-between border-bottom pb-1">
        <strong>{label}:</strong>
        <span className={isProblem ? "text-danger fw-bold" : "text-muted"}>
          {valor?.toUpperCase() || "-"}
          {isProblem && <i className="bi bi-exclamation-triangle-fill ms-2"></i>}
        </span>
      </div>
    );
  };

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-truck-front me-2"></i>
          Detalhes Frota #{checklist.id_cvf}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Accordion defaultActiveKey="0">
          
          <Accordion.Item eventKey="0">
            <Accordion.Header><i className="bi bi-info-circle me-2"></i> Dados da Viagem</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Motorista:</strong> {checklist.nome_motorista_vinculado || checklist.nome_motorista}</p>
                  <p><strong>Placa:</strong> <Badge bg="secondary">{checklist.placa}</Badge></p>
                </Col>
                <Col md={6}>
                  <p><strong>Destino:</strong> {checklist.destino}</p>
                  <p><strong>Data Saída:</strong> {formatarDataHora(checklist.criado_em)}</p>
                </Col>
              </Row>
              <Row className="mt-2 bg-light p-2 rounded mx-1">
                <Col md={6}><strong>KM Inicial:</strong> {checklist.km_inicial}</Col>
                <Col md={6}><strong>KM Final:</strong> {checklist.km_final}</Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header><i className="bi bi-clipboard-check me-2"></i> Itens Verificados</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                   <h6 className="text-primary">Mecânica & Segurança</h6>
                   {renderItem("Óleo do Motor OK?", checklist.oleo_motor)}
                   {renderItem("Água Radiador OK?", checklist.reservatorio_agua)}
                   {renderItem("Suspensão OK?", checklist.lubrificacao_suspensoes)}
                   {renderItem("Pneus OK?", checklist.estado_pneus)}
                   {renderItem("Elétrica OK?", checklist.sistema_eletrico)}
                </Col>
                <Col md={6}>
                   <h6 className="text-primary">Geral</h6>
                   {renderItem("Limpeza OK?", checklist.limpeza_bau_sider_cabine)}
                   {renderItem("Macaco Presente?", checklist.macaco)}
                   {renderItem("Chave Roda Presente?", checklist.chave_roda)}
                   {renderItem("Documento em Dia?", checklist.documento_vigente)}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header><i className="bi bi-fuel-pump me-2"></i> Abastecimento</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                    <strong>Abasteceu?</strong> {checklist.abastecimento?.toUpperCase()}
                </Col>
                <Col md={6}>
                    <strong>Comprovante Enviado?</strong> 
                    <span className={
                        (checklist.abastecimento === 'sim' && checklist.comprovante_enviado === 'não') 
                        ? "text-danger ms-2 fw-bold" 
                        : "ms-2"
                    }>
                        {checklist.comprovante_enviado?.toUpperCase()}
                    </span>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header><i className="bi bi-flag me-2"></i> Encerramento</Accordion.Header>
            <Accordion.Body>
               <p><strong>Data Encerramento:</strong> {formatarDataHora(checklist.data_encerramento_atividade)}</p>
               <div className="bg-light p-3 rounded mt-2">
                 <strong>Observações:</strong><br/>
                 {checklist.observacoes || "Nenhuma observação."}
               </div>
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}