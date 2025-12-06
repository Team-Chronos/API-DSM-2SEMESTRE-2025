import { Modal, Button, Accordion, Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarCpf, formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistVeiAgreg({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

  async function carregarChecklist() {
    try {
      const resposta = await api.get(`/checklistVeiculoAgregado/${idChecklist}`);
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

  const temProblema = (campo: string, valor: string) => {
    const val = normalizar(valor);
    if (['pne_liso', 'pte_liso', 'ptd_liso', 'pdd_liso'].includes(campo)) {
      return val === 'sim';
    }
    return val === 'nao';
  };

  const formatValue = (val: string) => val ? val.toUpperCase() : "-";

  const renderItem = (label: string, valor: string, campoChave: string) => {
    const isProblem = temProblema(campoChave, valor);
    return (
      <div className="mb-2 d-flex justify-content-between border-bottom pb-1">
        <strong>{label}:</strong>
        <span className={isProblem ? "text-danger fw-bold" : "text-muted"}>
          {formatValue(valor)}
          {isProblem && <i className="bi bi-exclamation-circle-fill ms-2"></i>}
        </span>
      </div>
    );
  };

  const renderImagem = (label: string, url?: string) => (
    <div className="mb-3 text-center p-2 border rounded bg-light h-100 d-flex flex-column">
      <strong className="d-block mb-2 text-primary">{label}</strong>
      {url ? (
        <div 
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{ cursor: "pointer" }}
          onClick={() => setImagemSelecionada(url)}
          title="Clique para ampliar"
        >
          <img 
            src={url} 
            alt={label} 
            className="img-fluid rounded shadow-sm hover-zoom" 
            style={{ maxHeight: "150px", objectFit: "cover", transition: "transform 0.2s" }} 
          />
        </div>
      ) : (
        <span className="text-muted my-auto">Sem imagem</span>
      )}
    </div>
  );

  return (
    <>
      <Modal show={show} size="lg" centered onHide={onClose}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-truck me-2"></i>
            Detalhes Veículo Agregado #{checklist.ID_cva}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header><i className="bi bi-person-vcard me-2"></i> Dados do Motorista e Veículo</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Motorista:</strong> {checklist.nome_motorista}</p>
                    <p><strong>CPF:</strong> {formatarCpf(checklist.cpf)}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Placa:</strong> <Badge bg="secondary">{checklist.placa_veiculo}</Badge></p>
                    <p><strong>Tipo:</strong> {checklist.tipo_veiculo}</p>
                    <p><strong>Data:</strong> {formatarDataHora(checklist.criado_em)}</p>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header><i className="bi bi-droplet-half me-2"></i> Motor e Níveis</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    {renderItem("Nível de Óleo Bom?", checklist.nivel_oleo, "nivel_oleo")}
                    {renderItem("Livre de Vazamentos?", checklist.vazamento_oleo, "vazamento_oleo")}
                    {renderItem("Nível de Água Bom?", checklist.nivel_agua, "nivel_agua")}
                  </Col>
                  <Col md={6}>
                     <div className="d-flex gap-2 justify-content-center">
                       <div style={{width: '100px'}}>
                          {renderImagem("Motor", checklist.foto_motor)}
                       </div>
                       <div style={{width: '100px'}}>
                          {renderImagem("Etiqueta", checklist.foto_etiqueta_troca_oleo)}
                       </div>
                     </div>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header><i className="bi bi-vinyl me-2"></i> Estado dos Pneus</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>{renderItem("Dianteiro Esquerdo Liso?", checklist.pne_liso, "pne_liso")}</Col>
                  <Col md={6}>{renderItem("Dianteiro Direito Liso?", checklist.pdd_liso, "pdd_liso")}</Col>
                  <Col md={6}>{renderItem("Traseiro Esquerdo Liso?", checklist.pte_liso, "pte_liso")}</Col>
                  <Col md={6}>{renderItem("Traseiro Direito Liso?", checklist.ptd_liso, "ptd_liso")}</Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header><i className="bi bi-shield-check me-2"></i> Segurança e Estrutura</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="text-primary border-bottom">Estrutura</h6>
                    {renderItem("Para-brisa OK?", checklist.parabrisa_perfeito, "parabrisa_perfeito")}
                    {renderItem("Limpeza Externa?", checklist.veiculo_externo_limpo, "veiculo_externo_limpo")}
                    {renderItem("Sem Amassados?", checklist.sem_amassado_ferrugem, "sem_amassado_ferrugem")}
                  </Col>
                  <Col md={6}>
                    <h6 className="text-primary border-bottom">Itens Obrigatórios</h6>
                    {renderItem("Extintor?", checklist.extintor, "extintor")}
                    {renderItem("Step?", checklist.step, "step")}
                    {renderItem("Macaco/Chave?", checklist.macaco, "macaco")}
                    {renderItem("EPIs Completos?", checklist.bota_seguranca, "bota_seguranca")}
                  </Col>
                </Row>
                <Row className="mt-3">
                   <Col md={12}>
                      <h6 className="text-primary border-bottom">Elétrica</h6>
                      <div className="d-flex flex-wrap gap-3">
                          {renderItem("Luz Freio", checklist.luz_freio, "luz_freio")}
                          {renderItem("Setas", checklist.setas_dianteiras, "setas_dianteiras")}
                          {renderItem("Faróis", checklist.farol_alto, "farol_alto")}
                      </div>
                   </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header><i className="bi bi-images me-2"></i> Galeria de Fotos</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col xs={6} md={4}>{renderImagem("Frente", checklist.foto_frente)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Traseira", checklist.foto_traseira)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Lateral Esq.", checklist.foto_lateral_esquerda)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Lateral Dir.", checklist.foto_lateral_direita)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Pneu DE", checklist.pne_foto)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Pneu DD", checklist.pdd_foto)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Pneu TE", checklist.pte_foto)}</Col>
                  <Col xs={6} md={4}>{renderImagem("Pneu TD", checklist.ptd_foto)}</Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header><i className="bi bi-chat-text me-2"></i> Observações e Responsável</Accordion.Header>
              <Accordion.Body>
                  <p><strong>Responsável Vistoria:</strong> {checklist.Nome_Col || checklist.nome_responsavel_vistoria}</p>
                  <div className="bg-light p-3 rounded">
                      <strong>Observações:</strong><br/>
                      {checklist.observacoes || "Nenhuma observação registrada."}
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

      <Modal 
        show={!!imagemSelecionada} 
        onHide={() => setImagemSelecionada(null)} 
        centered 
        size="xl"
        className="modal-zoom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualização da Imagem</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0 bg-dark d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          {imagemSelecionada && (
            <img 
              src={imagemSelecionada} 
              alt="Zoom" 
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} 
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}