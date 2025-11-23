import { Modal, Button, Accordion, Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistPredial({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);
  
  async function carregarChecklist() {
    try {
      const resposta = await api.get(`/checklistPredios/${idChecklist}`);
      setChecklist(resposta.data);
    } catch (err) {
      console.error("Erro ao carregar checklist predial:", err);
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
        <span>{label}</span>
        <span className={isProblem ? "text-danger fw-bold" : "text-success"}>
          {valor}
          {isProblem ? <i className="bi bi-x-circle ms-2"></i> : <i className="bi bi-check-circle ms-2"></i>}
        </span>
      </div>
    );
  };

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-building-lock me-2"></i>
          Detalhes Fechamento #{checklist.CheckPredio}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Accordion defaultActiveKey="0">

          <Accordion.Item eventKey="0">
            <Accordion.Header><i className="bi bi-person-badge me-2"></i> Informações Gerais</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <strong>Responsável:</strong> {checklist.NomeFuncPredio}
                </Col>
                <Col md={6}>
                  <strong>Data:</strong> {formatarDataHora(checklist.DataPredio)}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header><i className="bi bi-trash3 me-2"></i> Limpeza e Cozinha</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={12}>
                  {renderItem("Lixo da Cozinha Retirado?", checklist.LixoCozinha)}
                  {renderItem("Lixo Reciclável Retirado?", checklist.LixoReciclavel)}
                  {renderItem("Cozinha Organizada?", checklist.CozinhaOrganizada)}
                  {renderItem("Lixo Banheiro Retirado?", checklist.LixoBanheiro)}
                  {renderItem("Torneiras Fechadas?", checklist.TorneirasFechadas)}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header><i className="bi bi-shield-lock me-2"></i> Segurança e Trancas</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={12}>
                  {renderItem("Cadeado Portão 1 Trancado?", checklist.CadeadoPortao1)}
                  {renderItem("Cadeado Portão 2 Trancado?", checklist.CadeadoPortao2)}
                  {renderItem("Porta Armazém Fechada?", checklist.PortaArmazem)}
                  {renderItem("Cadeado Correntes Trancado?", checklist.CadeadoCorrentes)}
                  {renderItem("Porta Banheiro Trancada?", checklist.PortaBanheiro)}
                  {renderItem("Alarme Ativado?", checklist.Alarme)}
                  {renderItem("Chaves no Quadro?", checklist.ChavesChaveiro)}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header><i className="bi bi-lightning-charge me-2"></i> Energia e Equipamentos</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={12}>
                  {renderItem("Luzes Cozinha Apagadas?", checklist.LuzesCozinha)}
                  {renderItem("Luzes Operacional Apagadas?", checklist.LuzesOperacional)}
                  {renderItem("Luzes Armazém Acesas?", checklist.LuzesArmazem)}
                  {renderItem("Ar Condicionado Desligado?", checklist.ArCondicionado)}
                  {renderItem("Bebedouro Desligado?", checklist.BebedouroDesligado)}
                  {renderItem("TV Câmeras Desligada?", checklist.TVCameras)}
                  {renderItem("TV Dashboard Desligada?", checklist.TVDashboard)}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header><i className="bi bi-exclamation-octagon me-2"></i> Ocorrências</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <strong>Ruídos/Travamento nos Portões:</strong>
                <p className="text-muted bg-light p-2 rounded">
                  {checklist.MotorRuidos || "Não relatado."}
                </p>
              </div>
              <div>
                <strong>Situação Atípica:</strong>
                <p className="text-muted bg-light p-2 rounded">
                  {checklist.SituacaoAtip || "Não relatado."}
                </p>
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