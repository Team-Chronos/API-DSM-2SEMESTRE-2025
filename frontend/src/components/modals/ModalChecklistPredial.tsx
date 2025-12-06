import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner, Card, Row, Col, Badge, Accordion } from 'react-bootstrap';
import api from '../../services/api';

interface Checklist {
  id?: number | string;
  responsavel?: string;
  data_verificacao?: string;
  piso_adm?: string;
  piso_operacional?: string;
  piso_galpao?: string;
  piso_refeitorio?: string;
  forro_adm?: string;
  forro_operacional?: string;
  forro_galpao?: string;
  forro_refeitorio?: string;
  instalacoes_eletricas?: string;
  protecao_raios?: string;
  arcond_adm?: boolean;
  arcond_diretoria?: boolean;
  arcond_reuniao?: boolean;
  arcond_operacional?: boolean;
  lampadas_adm?: boolean;
  lampadas_diretoria?: boolean;
  lampadas_reuniao?: boolean;
  lampadas_operacional?: boolean;
  lampadas_galpao?: boolean;
  lampadas_refeitorio?: boolean;
  lampadas_banheirofem?: boolean;
  lampadas_banheiromasc?: boolean;
  macanetas_ok?: boolean;
  mesas_protecao_ok?: boolean;
  condicoes_paleteiras?: string;
  organizacao_local?: string;
  cameras_ok?: boolean;
  balanca_condicao?: string;
  data_afericao_balanca?: string;
  condicoes_mictorios?: string;
  data_limpeza_bebedouro?: string;
  data_prox_dedetizacao?: string;
  data_ult_recarga_extintores?: string;
  data_prox_recarga_extintores?: string;
  data_limpeza_caixa?: string;
  data_prox_limpeza?: string;
  cadeiras_ruim?: boolean;
  cadeiras_detalhe?: string;
  observacoes?: string;
  [key: string]: any;
}

interface FormData {
  responsavel: string;
  data_verificacao: string;
  piso_adm: string;
  piso_operacional: string;
  piso_galpao: string;
  piso_refeitorio: string;
  forro_adm: string;
  forro_operacional: string;
  forro_galpao: string;
  forro_refeitorio: string;
  instalacoes_eletricas: string;
  protecao_raios: string;
  arcond_adm: boolean;
  arcond_diretoria: boolean;
  arcond_reuniao: boolean;
  arcond_operacional: boolean;
  lampadas_adm: boolean;
  lampadas_diretoria: boolean;
  lampadas_reuniao: boolean;
  lampadas_operacional: boolean;
  lampadas_galpao: boolean;
  lampadas_refeitorio: boolean;
  lampadas_banheirofem: boolean;
  lampadas_banheiromasc: boolean;
  macanetas_ok: boolean;
  mesas_protecao_ok: boolean;
  condicoes_paleteiras: string;
  organizacao_local: string;
  cameras_ok: boolean;
  balanca_condicao: string;
  data_afericao_balanca: string;
  condicoes_mictorios: string;
  data_limpeza_bebedouro: string;
  data_prox_dedetizacao: string;
  data_ult_recarga_extintores: string;
  data_prox_recarga_extintores: string;
  data_limpeza_caixa: string;
  data_prox_limpeza: string;
  cadeiras_ruim: boolean;
  cadeiras_detalhe: string;
  observacoes: string;
}

interface LoadingState {
  page: boolean;
  submit: boolean;
}

interface DashboardStats {
  totalChecklists: number;
  checklistsMes: number;
  problemasIdentificados: number;
  statusGeral: string;
  checklistsSemana: number;
  percentualConformidade: number;
  areasCriticas: string[];
}

interface ModalChecklistProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ModalDetalhesProps {
  show: boolean;
  onClose: () => void;
  checklist: Checklist | null;
}

const ModalDetalhesChecklist = ({ show, onClose, checklist }: ModalDetalhesProps) => {
  if (!checklist) return null;

  const getFieldValue = (field: string): any => {
    const fieldVariations = [
      field,
      field.toLowerCase(),
      field.toUpperCase(),
      field.replace(/_/g, ''),
      `ID_${field}`,
      ...(field.includes('_') ? [field.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('_')] : [])
    ];

    for (const fieldName of fieldVariations) {
      if (checklist[fieldName] !== undefined && checklist[fieldName] !== null) {
        return checklist[fieldName];
      }
    }
    return null;
  };

  const formatFieldValue = (value: any): string => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (value === '') return '-';
    return String(value);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatSimpleDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const temProblema = (field: string, value: any): boolean => {
    if (typeof value === 'boolean') {
      if (field === 'cadeiras_ruim') {
        return value === true;
      }
      return value === false;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return lowerValue.includes('ruim') ||
        lowerValue.includes('defeito') ||
        lowerValue.includes('quebrad') ||
        lowerValue.includes('danificad') ||
        lowerValue.includes('problema');
    }

    return false;
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-eye me-2"></i>
          Detalhes do Checklist #{checklist.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <i className="bi bi-info-circle me-2"></i>
              Informações Básicas
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6} className="mb-2">
                  <strong>Responsável:</strong>
                  <div className="text-muted">{formatFieldValue(getFieldValue('responsavel'))}</div>
                </Col>
                <Col md={6} className="mb-2">
                  <strong>Data de Verificação:</strong>
                  <div className="text-muted">{formatDate(getFieldValue('data_verificacao'))}</div>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <i className="bi bi-house me-2"></i>
              Estado dos Pisos
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'piso_adm', label: 'Piso Administrativo' },
                  { field: 'piso_operacional', label: 'Piso Operacional' },
                  { field: 'piso_galpao', label: 'Piso Galpão' },
                  { field: 'piso_refeitorio', label: 'Piso Refeitório' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={`text-muted ${problema ? 'text-danger fw-bold' : ''}`}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-2">
                            Problema
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <i className="bi bi-building me-2"></i>
              Estado dos Forros
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'forro_adm', label: 'Forro Administrativo' },
                  { field: 'forro_operacional', label: 'Forro Operacional' },
                  { field: 'forro_galpao', label: 'Forro Galpão' },
                  { field: 'forro_refeitorio', label: 'Forro Refeitório' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={`text-muted ${problema ? 'text-danger fw-bold' : ''}`}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-2">
                            Problema
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <i className="bi bi-lightning-charge me-2"></i>
              Instalações Elétricas
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'instalacoes_eletricas', label: 'Instalações Elétricas' },
                  { field: 'protecao_raios', label: 'Proteção contra Raios' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={`text-muted ${problema ? 'text-danger fw-bold' : ''}`}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-2">
                            Problema
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <i className="bi bi-snow me-2"></i>
              Ar Condicionado
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'arcond_adm', label: 'ADM' },
                  { field: 'arcond_diretoria', label: 'Diretoria' },
                  { field: 'arcond_reuniao', label: 'Sala Reunião' },
                  { field: 'arcond_operacional', label: 'Operacional' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={3} className="mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={problema ? 'text-danger fw-bold' : ''}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-1">
                            ❗
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <i className="bi bi-lightbulb me-2"></i>
              Lâmpadas
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'lampadas_adm', label: 'ADM' },
                  { field: 'lampadas_diretoria', label: 'Diretoria' },
                  { field: 'lampadas_reuniao', label: 'Sala Reunião' },
                  { field: 'lampadas_operacional', label: 'Operacional' },
                  { field: 'lampadas_galpao', label: 'Galpão' },
                  { field: 'lampadas_refeitorio', label: 'Refeitório' },
                  { field: 'lampadas_banheirofem', label: 'Banheiro Feminino' },
                  { field: 'lampadas_banheiromasc', label: 'Banheiro Masculino' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={3} className="mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={problema ? 'text-danger fw-bold' : ''}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-1">
                            ❗
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="6">
            <Accordion.Header>
              <i className="bi bi-tools me-2"></i>
              Equipamentos e Segurança
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'macanetas_ok', label: 'Maçanetas OK' },
                  { field: 'mesas_protecao_ok', label: 'Mesas com Proteção OK' },
                  { field: 'cameras_ok', label: 'Câmeras OK' },
                  { field: 'cadeiras_ruim', label: 'Cadeiras em Estado Ruim' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.label}:</strong>
                          <div className={problema ? 'text-danger fw-bold' : ''}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-1">
                            ❗
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}

                {[
                  { field: 'condicoes_paleteiras', label: 'Condições das Paleteiras' },
                  { field: 'organizacao_local', label: 'Organização do Local' },
                  { field: 'balanca_condicao', label: 'Condição da Balança' },
                  { field: 'condicoes_mictorios', label: 'Condições dos Mictórios' },
                  { field: 'cadeiras_detalhe', label: 'Detalhes das Cadeiras' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  const problema = temProblema(item.field, value);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <strong>{item.label}:</strong>
                          <div className={`text-muted ${problema ? 'text-danger fw-bold' : ''}`}>
                            {formatFieldValue(value)}
                          </div>
                        </div>
                        {problema && (
                          <Badge bg="danger" className="ms-2">
                            Problema
                          </Badge>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7">
            <Accordion.Header>
              <i className="bi bi-calendar-date me-2"></i>
              Datas Importantes
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                {[
                  { field: 'data_afericao_balanca', label: 'Data Aferição Balança' },
                  { field: 'data_limpeza_bebedouro', label: 'Data Limpeza Bebedouro' },
                  { field: 'data_prox_dedetizacao', label: 'Próxima Dedetização' },
                  { field: 'data_ult_recarga_extintores', label: 'Última Recarga Extintores' },
                  { field: 'data_prox_recarga_extintores', label: 'Próxima Recarga Extintores' },
                  { field: 'data_limpeza_caixa', label: 'Data Limpeza Caixa' },
                  { field: 'data_prox_limpeza', label: 'Próxima Limpeza' }
                ].map((item, index) => {
                  const value = getFieldValue(item.field);
                  return (
                    <Col key={index} md={6} className="mb-2">
                      <strong>{item.label}:</strong>
                      <div className="text-muted">
                        {value ? formatSimpleDate(value) : '-'}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="8">
            <Accordion.Header>
              <i className="bi bi-chat-left-text me-2"></i>
              Observações
            </Accordion.Header>
            <Accordion.Body>
              <div className="text-muted">
                {getFieldValue('observacoes') ? formatFieldValue(getFieldValue('observacoes')) : 'Nenhuma observação registrada.'}
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="9">
            <Accordion.Header>
              <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
              Resumo de Problemas
            </Accordion.Header>
            <Accordion.Body>
              {(() => {
                const problemas: string[] = [];

                const camposParaVerificar = [
                  { field: 'arcond_adm', label: 'Ar Condicionado ADM' },
                  { field: 'arcond_diretoria', label: 'Ar Condicionado Diretoria' },
                  { field: 'arcond_reuniao', label: 'Ar Condicionado Sala Reunião' },
                  { field: 'arcond_operacional', label: 'Ar Condicionado Operacional' },
                  { field: 'lampadas_adm', label: 'Lâmpadas ADM' },
                  { field: 'lampadas_diretoria', label: 'Lâmpadas Diretoria' },
                  { field: 'lampadas_reuniao', label: 'Lâmpadas Sala Reunião' },
                  { field: 'lampadas_operacional', label: 'Lâmpadas Operacional' },
                  { field: 'lampadas_galpao', label: 'Lâmpadas Galpão' },
                  { field: 'lampadas_refeitorio', label: 'Lâmpadas Refeitório' },
                  { field: 'lampadas_banheirofem', label: 'Lâmpadas Banheiro Feminino' },
                  { field: 'lampadas_banheiromasc', label: 'Lâmpadas Banheiro Masculino' },
                  { field: 'macanetas_ok', label: 'Maçanetas' },
                  { field: 'mesas_protecao_ok', label: 'Mesas com Proteção' },
                  { field: 'cameras_ok', label: 'Câmeras' },
                  { field: 'cadeiras_ruim', label: 'Cadeiras' },
                  { field: 'piso_adm', label: 'Piso Administrativo' },
                  { field: 'piso_operacional', label: 'Piso Operacional' },
                  { field: 'piso_galpao', label: 'Piso Galpão' },
                  { field: 'piso_refeitorio', label: 'Piso Refeitório' },
                  { field: 'forro_adm', label: 'Forro Administrativo' },
                  { field: 'forro_operacional', label: 'Forro Operacional' },
                  { field: 'forro_galpao', label: 'Forro Galpão' },
                  { field: 'forro_refeitorio', label: 'Forro Refeitório' },
                  { field: 'instalacoes_eletricas', label: 'Instalações Elétricas' },
                  { field: 'protecao_raios', label: 'Proteção contra Raios' },
                  { field: 'condicoes_paleteiras', label: 'Paleteiras' },
                  { field: 'balanca_condicao', label: 'Balança' },
                  { field: 'condicoes_mictorios', label: 'Mictórios' }
                ];

                camposParaVerificar.forEach(({ field, label }) => {
                  const value = getFieldValue(field);
                  if (temProblema(field, value)) {
                    problemas.push(label);
                  }
                });

                if (problemas.length === 0) {
                  return <div className="text-success"> Nenhum problema identificado</div>;
                }

                return (
                  <div>
                    <div className="text-danger mb-2 fw-bold">
                      ❗ {problemas.length} problema(s) identificado(s):
                    </div>
                    <ul className="list-unstyled">
                      {problemas.map((problema, index) => (
                        <li key={index} className="text-danger mb-1">
                          • {problema}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
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
};

const ModalChecklist = ({ show, onClose, onSuccess }: ModalChecklistProps) => {
  const [form, setForm] = useState<FormData>({
    responsavel: '',
    data_verificacao: new Date().toISOString().slice(0, 16),
    piso_adm: '',
    piso_operacional: '',
    piso_galpao: '',
    piso_refeitorio: '',
    forro_adm: '',
    forro_operacional: '',
    forro_galpao: '',
    forro_refeitorio: '',
    instalacoes_eletricas: '',
    protecao_raios: '',
    arcond_adm: false,
    arcond_diretoria: false,
    arcond_reuniao: false,
    arcond_operacional: false,
    lampadas_adm: false,
    lampadas_diretoria: false,
    lampadas_reuniao: false,
    lampadas_operacional: false,
    lampadas_galpao: false,
    lampadas_refeitorio: false,
    lampadas_banheirofem: false,
    lampadas_banheiromasc: false,
    macanetas_ok: false,
    mesas_protecao_ok: false,
    condicoes_paleteiras: '',
    organizacao_local: '',
    cameras_ok: false,
    balanca_condicao: '',
    data_afericao_balanca: '',
    condicoes_mictorios: '',
    data_limpeza_bebedouro: '',
    data_prox_dedetizacao: '',
    data_ult_recarga_extintores: '',
    data_prox_recarga_extintores: '',
    data_limpeza_caixa: '',
    data_prox_limpeza: '',
    cadeiras_ruim: false,
    cadeiras_detalhe: '',
    observacoes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!form.responsavel.trim()) return 'O campo Responsável é obrigatório';
    if (!form.data_verificacao) return 'O campo Data de Verificação é obrigatório';

    const selectedDate = new Date(form.data_verificacao);
    if (selectedDate > new Date()) return 'A data de verificação não pode ser futura';

    return null;
  };

  const limparForm = () => {
    setForm({
      responsavel: '',
      data_verificacao: new Date().toISOString().slice(0, 16),
      piso_adm: '',
      piso_operacional: '',
      piso_galpao: '',
      piso_refeitorio: '',
      forro_adm: '',
      forro_operacional: '',
      forro_galpao: '',
      forro_refeitorio: '',
      instalacoes_eletricas: '',
      protecao_raios: '',
      arcond_adm: false,
      arcond_diretoria: false,
      arcond_reuniao: false,
      arcond_operacional: false,
      lampadas_adm: false,
      lampadas_diretoria: false,
      lampadas_reuniao: false,
      lampadas_operacional: false,
      lampadas_galpao: false,
      lampadas_refeitorio: false,
      lampadas_banheirofem: false,
      lampadas_banheiromasc: false,
      macanetas_ok: false,
      mesas_protecao_ok: false,
      condicoes_paleteiras: '',
      organizacao_local: '',
      cameras_ok: false,
      balanca_condicao: '',
      data_afericao_balanca: '',
      condicoes_mictorios: '',
      data_limpeza_bebedouro: '',
      data_prox_dedetizacao: '',
      data_ult_recarga_extintores: '',
      data_prox_recarga_extintores: '',
      data_limpeza_caixa: '',
      data_prox_limpeza: '',
      cadeiras_ruim: false,
      cadeiras_detalhe: '',
      observacoes: ''
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const dadosParaEnvio = {
        responsavel: form.responsavel,
        data_verificacao: form.data_verificacao,
        piso_adm: form.piso_adm || '',
        piso_operacional: form.piso_operacional || '',
        piso_galpao: form.piso_galpao || '',
        piso_refeitorio: form.piso_refeitorio || '',
        forro_adm: form.forro_adm || '',
        forro_operacional: form.forro_operacional || '',
        forro_galpao: form.forro_galpao || '',
        forro_refeitorio: form.forro_refeitorio || '',
        instalacoes_eletricas: form.instalacoes_eletricas || '',
        protecao_raios: form.protecao_raios || '',
        condicoes_paleteiras: form.condicoes_paleteiras || '',
        organizacao_local: form.organizacao_local || '',
        balanca_condicao: form.balanca_condicao || '',
        condicoes_mictorios: form.condicoes_mictorios || '',
        cadeiras_detalhe: form.cadeiras_detalhe || '',
        observacoes: form.observacoes || '',
        arcond_adm: form.arcond_adm,
        arcond_diretoria: form.arcond_diretoria,
        arcond_reuniao: form.arcond_reuniao,
        arcond_operacional: form.arcond_operacional,
        lampadas_adm: form.lampadas_adm,
        lampadas_diretoria: form.lampadas_diretoria,
        lampadas_reuniao: form.lampadas_reuniao,
        lampadas_operacional: form.lampadas_operacional,
        lampadas_galpao: form.lampadas_galpao,
        lampadas_refeitorio: form.lampadas_refeitorio,
        lampadas_banheirofem: form.lampadas_banheirofem,
        lampadas_banheiromasc: form.lampadas_banheiromasc,
        macanetas_ok: form.macanetas_ok,
        mesas_protecao_ok: form.mesas_protecao_ok,
        cameras_ok: form.cameras_ok,
        cadeiras_ruim: form.cadeiras_ruim,
        data_afericao_balanca: form.data_afericao_balanca || '',
        data_limpeza_bebedouro: form.data_limpeza_bebedouro || '',
        data_prox_dedetizacao: form.data_prox_dedetizacao || '',
        data_ult_recarga_extintores: form.data_ult_recarga_extintores || '',
        data_prox_recarga_extintores: form.data_prox_recarga_extintores || '',
        data_limpeza_caixa: form.data_limpeza_caixa || '',
        data_prox_limpeza: form.data_prox_limpeza || ''
      };

      console.log('Dados sendo enviados - Ar Condicionado:', {
        arcond_adm: dadosParaEnvio.arcond_adm,
        arcond_diretoria: dadosParaEnvio.arcond_diretoria,
        arcond_reuniao: dadosParaEnvio.arcond_reuniao,
        arcond_operacional: dadosParaEnvio.arcond_operacional
      });

      await api.post('/checklist', dadosParaEnvio);

      onSuccess();
      limparForm();
      onClose();
    } catch (err: any) {
      console.error('Erro detalhado ao criar checklist:', err);
      const errorMessage = err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        'Erro ao criar checklist';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      centered
      size="xl"
      scrollable
      onHide={() => {
        limparForm();
        onClose();
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="bi bi-clipboard-check me-2"></i>
            Novo Checklist Predial
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <div className="alert alert-danger">
              <strong>Erro:</strong> {error}
            </div>
          )}

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Informações Básicas</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Responsável *</Form.Label>
                <Form.Control
                  type="text"
                  name="responsavel"
                  value={form.responsavel}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="Nome do responsável"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Data de Verificação *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="data_verificacao"
                  value={form.data_verificacao}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Estado dos Pisos</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Piso Administrativo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="piso_adm"
                  value={form.piso_adm}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do piso administrativo"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Piso Operacional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="piso_operacional"
                  value={form.piso_operacional}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do piso operacional"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Piso Galpão</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="piso_galpao"
                  value={form.piso_galpao}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do piso do galpão"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Piso Refeitório</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="piso_refeitorio"
                  value={form.piso_refeitorio}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do piso do refeitório"
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Estado dos Forros</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Forro Administrativo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="forro_adm"
                  value={form.forro_adm}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do forro administrativo"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Forro Operacional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="forro_operacional"
                  value={form.forro_operacional}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do forro operacional"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Forro Galpão</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="forro_galpao"
                  value={form.forro_galpao}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do forro do galpão"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Forro Refeitório</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="forro_refeitorio"
                  value={form.forro_refeitorio}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado do forro do refeitório"
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Instalações Elétricas</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Instalações Elétricas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="instalacoes_eletricas"
                  value={form.instalacoes_eletricas}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado das instalações elétricas"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Proteção contra Raios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="protecao_raios"
                  value={form.protecao_raios}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva o estado da proteção contra raios"
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Ar Condicionado</h6>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="arcond_adm"
                  checked={form.arcond_adm}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="ADM"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="arcond_diretoria"
                  checked={form.arcond_diretoria}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Diretoria"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="arcond_reuniao"
                  checked={form.arcond_reuniao}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Sala Reunião"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="arcond_operacional"
                  checked={form.arcond_operacional}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Operacional"
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Lâmpadas</h6>
            <Row>
              {[
                { name: 'lampadas_adm', label: 'ADM' },
                { name: 'lampadas_diretoria', label: 'Diretoria' },
                { name: 'lampadas_reuniao', label: 'Sala Reunião' },
                { name: 'lampadas_operacional', label: 'Operacional' },
                { name: 'lampadas_galpao', label: 'Galpão' },
                { name: 'lampadas_refeitorio', label: 'Refeitório' },
                { name: 'lampadas_banheirofem', label: 'Banheiro Feminino' },
                { name: 'lampadas_banheiromasc', label: 'Banheiro Masculino' }
              ].map((item) => (
                <Col key={item.name} md={3} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name as keyof FormData] as boolean}
                    onChange={handleInputChange}
                    disabled={loading}
                    label={item.label}
                  />
                </Col>
              ))}
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Equipamentos</h6>
            <Row className="mb-3">
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="macanetas_ok"
                  checked={form.macanetas_ok}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Maçanetas OK"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="mesas_protecao_ok"
                  checked={form.mesas_protecao_ok}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Mesas com Proteção OK"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="cameras_ok"
                  checked={form.cameras_ok}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Câmeras OK"
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="cadeiras_ruim"
                  checked={form.cadeiras_ruim}
                  onChange={handleInputChange}
                  disabled={loading}
                  label="Cadeiras em Estado Ruim"
                />
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Condições das Paleteiras</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="condicoes_paleteiras"
                  value={form.condicoes_paleteiras}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva as condições das paleteiras"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Organização do Local</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="organizacao_local"
                  value={form.organizacao_local}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva a organização do local"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Condição da Balança</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="balanca_condicao"
                  value={form.balanca_condicao}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva a condição da balança"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Condições dos Mictórios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="condicoes_mictorios"
                  value={form.condicoes_mictorios}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Descreva as condições dos mictórios"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Detalhes das Cadeiras</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="cadeiras_detalhe"
                  value={form.cadeiras_detalhe}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Detalhes sobre as cadeiras"
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Datas Importantes</h6>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Data Aferição Balança</Form.Label>
                <Form.Control
                  type="date"
                  name="data_afericao_balanca"
                  value={form.data_afericao_balanca}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Data Limpeza Bebedouro</Form.Label>
                <Form.Control
                  type="date"
                  name="data_limpeza_bebedouro"
                  value={form.data_limpeza_bebedouro}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Próxima Dedetização</Form.Label>
                <Form.Control
                  type="date"
                  name="data_prox_dedetizacao"
                  value={form.data_prox_dedetizacao}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Última Recarga Extintores</Form.Label>
                <Form.Control
                  type="date"
                  name="data_ult_recarga_extintores"
                  value={form.data_ult_recarga_extintores}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Próxima Recarga Extintores</Form.Label>
                <Form.Control
                  type="date"
                  name="data_prox_recarga_extintores"
                  value={form.data_prox_recarga_extintores}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Data Limpeza Caixa</Form.Label>
                <Form.Control
                  type="date"
                  name="data_limpeza_caixa"
                  value={form.data_limpeza_caixa}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Próxima Limpeza</Form.Label>
                <Form.Control
                  type="date"
                  name="data_prox_limpeza"
                  value={form.data_prox_limpeza}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h6 className="border-bottom pb-2 text-primary">Observações Finais</h6>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Observações Gerais</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Observações adicionais..."
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              limparForm();
              onClose();
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Salvar Checklist
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

function ChecklistPage() {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    page: true,
    submit: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalDetalhes, setShowModalDetalhes] = useState(false);
  const [checklistSelecionado, setChecklistSelecionado] = useState<Checklist | null>(null);
  const [showAllChecklists, setShowAllChecklists] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalChecklists: 0,
    checklistsMes: 0,
    problemasIdentificados: 0,
    statusGeral: 'Bom',
    checklistsSemana: 0,
    percentualConformidade: 100,
    areasCriticas: []
  });

  const fetchChecklists = async (): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, page: true }));
      setError(null);
      const response = await api.get('/checklist');
      const data = response.data;

      let checklistsData: Checklist[] = [];

      if (Array.isArray(data)) {
        checklistsData = data;
      } else if (data?.checklists && Array.isArray(data.checklists)) {
        checklistsData = data.checklists;
      } else if (data?.data && Array.isArray(data.data)) {
        checklistsData = data.data;
      } else if (typeof data === 'object' && data !== null) {
        checklistsData = [data];
      }

      setChecklists(checklistsData);
    } catch (err: any) {
      console.error('Erro ao carregar checklists:', err);
      setError(err.response?.data?.mensagem || 'Erro ao carregar checklists');
    } finally {
      setLoading((prev) => ({ ...prev, page: false }));
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  useEffect(() => {
    if (checklists.length > 0) {
      const agora = new Date();
      const primeiroDiaMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      const primeiroDiaSemana = new Date(agora);
      primeiroDiaSemana.setDate(agora.getDate() - agora.getDay());

      const checklistsEsteMes = checklists.filter(checklist => {
        const dataChecklist = new Date(getChecklistValue(checklist, 'data_verificacao'));
        return dataChecklist >= primeiroDiaMes;
      });

      const checklistsEstaSemana = checklists.filter(checklist => {
        const dataChecklist = new Date(getChecklistValue(checklist, 'data_verificacao'));
        return dataChecklist >= primeiroDiaSemana;
      });

      let problemas = 0;
      const areasProblema: string[] = [];

      checklists.forEach(checklist => {
        const problemasCheckboxes = [
          { field: 'arcond_adm', nome: 'Ar Condicionado ADM' },
          { field: 'arcond_diretoria', nome: 'Ar Condicionado Diretoria' },
          { field: 'arcond_reuniao', nome: 'Ar Condicionado Reunião' },
          { field: 'arcond_operacional', nome: 'Ar Condicionado Operacional' },
          { field: 'lampadas_adm', nome: 'Lâmpadas ADM' },
          { field: 'lampadas_diretoria', nome: 'Lâmpadas Diretoria' },
          { field: 'lampadas_reuniao', nome: 'Lâmpadas Reunião' },
          { field: 'lampadas_operacional', nome: 'Lâmpadas Operacional' },
          { field: 'lampadas_galpao', nome: 'Lâmpadas Galpão' },
          { field: 'lampadas_refeitorio', nome: 'Lâmpadas Refeitório' },
          { field: 'lampadas_banheirofem', nome: 'Lâmpadas Banheiro Feminino' },
          { field: 'lampadas_banheiromasc', nome: 'Lâmpadas Banheiro Masculino' },
          { field: 'macanetas_ok', nome: 'Maçanetas' },
          { field: 'mesas_protecao_ok', nome: 'Mesas com Proteção' },
          { field: 'cameras_ok', nome: 'Câmeras' }
        ];

        problemasCheckboxes.forEach(({ field, nome }) => {
          if (checklist[field] === false) {
            problemas++;
            if (!areasProblema.includes(nome)) areasProblema.push(nome);
          }
        });

        if (checklist.cadeiras_ruim === true) {
          problemas++;
          if (!areasProblema.includes('Cadeiras')) areasProblema.push('Cadeiras');
        }

        const condicoesPaleteiras = getChecklistValue(checklist, 'condicoes_paleteiras').toLowerCase();
        if (condicoesPaleteiras.includes('ruim') || condicoesPaleteiras.includes('defeito') || condicoesPaleteiras.includes('quebrad')) {
          problemas++;
          if (!areasProblema.includes('Paleteiras')) areasProblema.push('Paleteiras');
        }

        const balancaCondicao = getChecklistValue(checklist, 'balanca_condicao').toLowerCase();
        if (balancaCondicao.includes('ruim') || balancaCondicao.includes('defeito') || balancaCondicao.includes('quebrad')) {
          problemas++;
          if (!areasProblema.includes('Balança')) areasProblema.push('Balança');
        }
      });

      const percentualConformidade = Math.max(0, 100 - (problemas / checklists.length) * 100);

      let statusGeral = 'Bom';
      if (percentualConformidade < 70) {
        statusGeral = 'Crítico';
      } else if (percentualConformidade < 85) {
        statusGeral = 'Atenção';
      }

      setDashboardStats({
        totalChecklists: checklists.length,
        checklistsMes: checklistsEsteMes.length,
        problemasIdentificados: problemas,
        statusGeral,
        checklistsSemana: checklistsEstaSemana.length,
        percentualConformidade: Math.round(percentualConformidade),
        areasCriticas: areasProblema.slice(0, 3)
      });
    } else {
      setDashboardStats({
        totalChecklists: 0,
        checklistsMes: 0,
        problemasIdentificados: 0,
        statusGeral: 'Bom',
        checklistsSemana: 0,
        percentualConformidade: 100,
        areasCriticas: []
      });
    }
  }, [checklists]);

  const getChecklistValue = (checklist: Checklist, field: string): string => {
    const fieldVariations = [
      field,
      field.toLowerCase(),
      field.toUpperCase(),
      field.replace(/_/g, ''),
      `ID_${field}`,
      ...(field.includes('_') ? [field.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('_')] : [])
    ];

    for (const fieldName of fieldVariations) {
      if (checklist[fieldName] !== undefined && checklist[fieldName] !== null) {
        const value = checklist[fieldName];
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        return String(value);
      }
    }

    return '';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Bom': return 'success';
      case 'Atenção': return 'warning';
      case 'Crítico': return 'danger';
      default: return 'secondary';
    }
  };

  const handleSuccess = () => {
    fetchChecklists();
    setSuccess('Checklist criado com sucesso!');
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleVerDetalhes = (checklist: Checklist) => {
    setChecklistSelecionado(checklist);
    setShowModalDetalhes(true);
  };

  const temProblemas = (checklist: Checklist): boolean => {
    const problemasCheckboxes = [
      'arcond_adm', 'arcond_diretoria', 'arcond_reuniao', 'arcond_operacional',
      'lampadas_adm', 'lampadas_diretoria', 'lampadas_reuniao', 'lampadas_operacional',
      'lampadas_galpao', 'lampadas_refeitorio', 'lampadas_banheirofem', 'lampadas_banheiromasc',
      'macanetas_ok', 'mesas_protecao_ok', 'cameras_ok'
    ];

    const temCheckboxProblema = problemasCheckboxes.some(field => checklist[field] === false);

    const temCadeirasRuim = checklist.cadeiras_ruim === true;
    const temPaleteirasProblema = getChecklistValue(checklist, 'condicoes_paleteiras').toLowerCase().includes('ruim') ||
      getChecklistValue(checklist, 'condicoes_paleteiras').toLowerCase().includes('defeito') ||
      getChecklistValue(checklist, 'condicoes_paleteiras').toLowerCase().includes('quebrad');
    const temBalancaProblema = getChecklistValue(checklist, 'balanca_condicao').toLowerCase().includes('ruim') ||
      getChecklistValue(checklist, 'balanca_condicao').toLowerCase().includes('defeito') ||
      getChecklistValue(checklist, 'balanca_condicao').toLowerCase().includes('quebrad');

    return temCheckboxProblema || temCadeirasRuim || temPaleteirasProblema || temBalancaProblema;
  };

  const renderContent = () => {
    if (loading.page) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando checklists...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      );
    }

    if (checklists.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-clipboard-x display-4 text-muted"></i>
          <p className="mt-2 text-muted">Nenhum checklist encontrado.</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Criar Primeiro Checklist
          </Button>
        </div>
      );
    }

    const checklistsToShow = showAllChecklists ? checklists : checklists.slice(0, 5);

    return (
      <div className="table-responsive mt-4">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Responsável</th>
              <th>Data de Verificação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {checklistsToShow.map((c, i) => {
              const temProblema = temProblemas(c);

              return (
                <tr key={c.id || i} className={temProblema ? 'table-warning' : ''}>
                  <td>
                    <Badge bg="secondary">#{c.id || i + 1}</Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-circle me-2 text-primary"></i>
                      {getChecklistValue(c, 'responsavel')}
                    </div>
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(c.data_verificacao || getChecklistValue(c, 'data_verificacao'))}
                    </small>
                  </td>
                  <td>
                    <Badge bg={temProblema ? 'warning' : 'success'}>
                      {temProblema ? ' Atenção' : ' OK'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleVerDetalhes(c)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Ver Mais
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {checklists.length > 5 && (
          <div className="text-center mt-3">
            <Button
              variant="outline-primary"
              onClick={() => setShowAllChecklists(!showAllChecklists)}
            >
              <i className={`bi bi-${showAllChecklists ? 'chevron-up' : 'chevron-down'} me-2`}></i>
              {showAllChecklists ? 'Mostrar Menos' : `Ver Todos (${checklists.length})`}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-secondary"
            className="border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </Button>
          <div>
            <h1 className="h3 mb-1">Checklist Predial</h1>
            <p className="text-muted mb-0">Gestão e monitoramento das condições prediais</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Novo Checklist
        </Button>
      </div>

      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>
            <strong>Sucesso:</strong> {success}
          </div>
        </div>
      )}

      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <Card className={`border-0 bg-${getStatusClass(dashboardStats.statusGeral)} text-white h-100`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h6">Status Geral</Card.Title>
                  <h2 className="mb-0">{dashboardStats.statusGeral}</h2>
                  <small>Conformidade: {dashboardStats.percentualConformidade}%</small>
                </div>
                <div className="fs-1">
                  {dashboardStats.statusGeral === 'Bom' && '✓'}
                  {dashboardStats.statusGeral === 'Atenção' && '⚠'}
                  {dashboardStats.statusGeral === 'Crítico' && '❗'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-0 bg-info text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h6">Total de Checklists</Card.Title>
                  <h2 className="mb-0">{dashboardStats.totalChecklists}</h2>
                  <small>Desde o início</small>
                </div>
                <div className="fs-1">
                  <i className="bi bi-clipboard-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-0 bg-secondary text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h6">Este Mês</Card.Title>
                  <h2 className="mb-0">{dashboardStats.checklistsMes}</h2>
                  <small>{dashboardStats.checklistsSemana} esta semana</small>
                </div>
                <div className="fs-1">
                  <i className="bi bi-calendar-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-0 bg-warning text-dark h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h6">Problemas</Card.Title>
                  <h2 className="mb-0">{dashboardStats.problemasIdentificados}</h2>
                  <small>Identificados</small>
                </div>
                <div className="fs-1">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="bi bi-list-check me-2"></i>
              Checklists Registrados
            </h5>
            <Badge bg="primary" pill>{checklists.length}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {renderContent()}
        </Card.Body>
      </Card>

      <ModalChecklist
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />

      <ModalDetalhesChecklist
        show={showModalDetalhes}
        onClose={() => setShowModalDetalhes(false)}
        checklist={checklistSelecionado}
      />
    </div>
  );
}

export default ChecklistPage;