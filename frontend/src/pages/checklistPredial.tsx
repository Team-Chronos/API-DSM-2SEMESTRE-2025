import { useState, useEffect } from 'react';
import axios from 'axios';

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

export default function ChecklistPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    page: true,
    submit: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    responsavel: '',
    data_verificacao: '',
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

  const fetchChecklists = async (): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, page: true }));
      setError(null);
      const response = await axios.get('http://localhost:3000/api/checklist');
      const data = response.data;
      
      console.log('Dados recebidos do backend:', data);
      
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
    const requiredFields = [
      'responsavel', 'data_verificacao', 'piso_adm', 'piso_operacional', 
      'piso_galpao', 'piso_refeitorio', 'forro_adm', 'forro_operacional',
      'forro_galpao', 'forro_refeitorio', 'instalacoes_eletricas', 'protecao_raios',
      'condicoes_paleteiras', 'organizacao_local', 'balanca_condicao',
      'condicoes_mictorios'
    ];

    for (const field of requiredFields) {
      const value = form[field as keyof FormData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `O campo ${field.replace(/_/g, ' ')} é obrigatório`;
      }
    }

    if (!form.responsavel.trim()) return 'O campo Responsável é obrigatório';
    if (!form.data_verificacao) return 'O campo Data de Verificação é obrigatório';
    
    const selectedDate = new Date(form.data_verificacao);
    if (selectedDate > new Date()) return 'A data de verificação não pode ser futura';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submit: true }));

      console.log('Enviando dados para o backend:', form);

      const dadosParaEnvio = {
        ...form,
        data_afericao_balanca: form.data_afericao_balanca || null,
        data_limpeza_bebedouro: form.data_limpeza_bebedouro || null,
        data_prox_dedetizacao: form.data_prox_dedetizacao || null,
        data_ult_recarga_extintores: form.data_ult_recarga_extintores || null,
        data_prox_recarga_extintores: form.data_prox_recarga_extintores || null,
        data_limpeza_caixa: form.data_limpeza_caixa || null,
        data_prox_limpeza: form.data_prox_limpeza || null
      };

      const response = await axios.post('http://localhost:3000/api/checklist', dadosParaEnvio);

      console.log('Resposta do backend:', response.data);

      const result: Checklist = response.data;
      setChecklists((prev) => [result, ...prev]);
      setSuccess('Checklist criado com sucesso!');
      
      // Reset form
      const resetForm: FormData = {
        responsavel: '',
        data_verificacao: '',
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
      };
      
      setForm(resetForm);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Erro detalhado ao criar checklist:', err);
      const errorMessage = err.response?.data?.mensagem || 
                          err.response?.data?.erro || 
                          'Erro ao criar checklist';
      setError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
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

  const getChecklistValue = (checklist: Checklist, field: string): string => {
    const fieldMap: { [key: string]: string[] } = {
      responsavel: ['responsavel', 'Responsavel', 'responsável'],
      data_verificacao: ['data_verificacao', 'Data_Verificacao', 'dataVerificacao', 'data'],
      observacoes: ['observacoes', 'Observacoes', 'observações'],
      id: ['id', 'ID_Checklist', 'ID', 'id_checklist']
    };

    for (const key of fieldMap[field] || [field]) {
      if (checklist[key] !== undefined && checklist[key] !== null) {
        if (typeof checklist[key] === 'boolean') {
          return checklist[key] ? 'Sim' : 'Não';
        }
        return String(checklist[key]);
      }
    }
    return '';
  };

  const getRowId = (checklist: Checklist, index: number): string =>
    getChecklistValue(checklist, 'id') || `checklist-${index}`;

  const renderContent = () => {
    if (loading.page) {
      return <p className="text-center mt-4">Carregando checklists...</p>;
    }

    if (error) {
      return <div className="alert alert-danger mt-4">{error}</div>;
    }

    if (checklists.length === 0) {
      return <p className="text-center mt-4">Nenhum checklist encontrado.</p>;
    }

    return (
      <div className="table-responsive mt-4">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Responsável</th>
              <th>Data de Verificação</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((c, i) => (
              <tr key={getRowId(c, i)}>
                <td>{getChecklistValue(c, 'id') || i + 1}</td>
                <td>{getChecklistValue(c, 'responsavel')}</td>
                <td>{formatDate(getChecklistValue(c, 'data_verificacao'))}</td>
                <td>{getChecklistValue(c, 'observacoes') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Checklist Predial Completo</h1>
      </div>
      <p>
        Preencha todos os campos obrigatórios do checklist de manutenção predial
      </p>
      <div className="mb-4">
        {error && (
          <div className="alert alert-danger">
            <strong>Erro:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <strong>Sucesso:</strong> {success}
          </div>
        )}
      </div>
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">Formulário de Verificação Predial</h5>
          <small className="text-muted">Todos os campos marcados com * são obrigatórios</small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Informações Básicas</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Responsável *
                  </label>
                  <input
                    type="text"
                    name="responsavel"
                    value={form.responsavel}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    className="form-control"
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Data de Verificação *
                  </label>
                  <input
                    type="datetime-local"
                    name="data_verificacao"
                    value={form.data_verificacao}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Estado dos Pisos *</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Piso Administrativo
                  </label>
                  <textarea
                    name="piso_adm"
                    value={form.piso_adm}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do piso administrativo"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Piso Operacional
                  </label>
                  <textarea
                    name="piso_operacional"
                    value={form.piso_operacional}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do piso operacional"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Piso Galpão
                  </label>
                  <textarea
                    name="piso_galpao"
                    value={form.piso_galpao}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do piso do galpão"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Piso Refeitório
                  </label>
                  <textarea
                    name="piso_refeitorio"
                    value={form.piso_refeitorio}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do piso do refeitório"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Estado dos Forros *</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Forro Administrativo
                  </label>
                  <textarea
                    name="forro_adm"
                    value={form.forro_adm}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do forro administrativo"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Forro Operacional
                  </label>
                  <textarea
                    name="forro_operacional"
                    value={form.forro_operacional}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do forro operacional"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Forro Galpão
                  </label>
                  <textarea
                    name="forro_galpao"
                    value={form.forro_galpao}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do forro do galpão"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Forro Refeitório
                  </label>
                  <textarea
                    name="forro_refeitorio"
                    value={form.forro_refeitorio}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado do forro do refeitório"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Instalações Elétricas *</h6>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Instalações Elétricas
                  </label>
                  <textarea
                    name="instalacoes_eletricas"
                    value={form.instalacoes_eletricas}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado das instalações elétricas"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Proteção contra Raios
                  </label>
                  <textarea
                    name="protecao_raios"
                    value={form.protecao_raios}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva o estado da proteção contra raios"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Ar Condicionado</h6>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="arcond_adm"
                      checked={form.arcond_adm}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">ADM</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="arcond_diretoria"
                      checked={form.arcond_diretoria}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Diretoria</label>
                  </div>
                </div>

                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="arcond_reuniao"
                      checked={form.arcond_reuniao}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Sala Reunião</label>
                  </div>
                </div>

                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="arcond_operacional"
                      checked={form.arcond_operacional}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Operacional</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Lâmpadas</h6>
              <div className="row">
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
                  <div key={item.name} className="col-md-3 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={form[item.name as keyof FormData] as boolean}
                        onChange={handleInputChange}
                        disabled={loading.submit}
                        className="form-check-input"
                      />
                      <label className="form-check-label">{item.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Equipamentos *</h6>
              <div className="row mb-3">
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="macanetas_ok"
                      checked={form.macanetas_ok}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Maçanetas OK</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="mesas_protecao_ok"
                      checked={form.mesas_protecao_ok}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Mesas com Proteção OK</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="cameras_ok"
                      checked={form.cameras_ok}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Câmeras OK</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="cadeiras_ruim"
                      checked={form.cadeiras_ruim}
                      onChange={handleInputChange}
                      disabled={loading.submit}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Cadeiras em Estado Ruim</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Condições das Paleteiras *
                  </label>
                  <textarea
                    name="condicoes_paleteiras"
                    value={form.condicoes_paleteiras}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva as condições das paleteiras"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Organização do Local *
                  </label>
                  <textarea
                    name="organizacao_local"
                    value={form.organizacao_local}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva a organização do local"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Condição da Balança *
                  </label>
                  <textarea
                    name="balanca_condicao"
                    value={form.balanca_condicao}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva a condição da balança"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Condições dos Mictórios *
                  </label>
                  <textarea
                    name="condicoes_mictorios"
                    value={form.condicoes_mictorios}
                    onChange={handleInputChange}
                    required
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Descreva as condições dos mictórios"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Detalhes das Cadeiras
                  </label>
                  <textarea
                    name="cadeiras_detalhe"
                    value={form.cadeiras_detalhe}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    rows={3}
                    className="form-control"
                    placeholder="Detalhes sobre as cadeiras"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Datas Importantes</h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Data Aferição Balança
                  </label>
                  <input
                    type="date"
                    name="data_afericao_balanca"
                    value={form.data_afericao_balanca}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Data Limpeza Bebedouro
                  </label>
                  <input
                    type="date"
                    name="data_limpeza_bebedouro"
                    value={form.data_limpeza_bebedouro}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Próxima Dedetização
                  </label>
                  <input
                    type="date"
                    name="data_prox_dedetizacao"
                    value={form.data_prox_dedetizacao}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Última Recarga Extintores
                  </label>
                  <input
                    type="date"
                    name="data_ult_recarga_extintores"
                    value={form.data_ult_recarga_extintores}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Próxima Recarga Extintores
                  </label>
                  <input
                    type="date"
                    name="data_prox_recarga_extintores"
                    value={form.data_prox_recarga_extintores}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Data Limpeza Caixa
                  </label>
                  <input
                    type="date"
                    name="data_limpeza_caixa"
                    value={form.data_limpeza_caixa}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Próxima Limpeza
                  </label>
                  <input
                    type="date"
                    name="data_prox_limpeza"
                    value={form.data_prox_limpeza}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="border-bottom pb-2">Observações Finais</h6>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Observações Gerais
                  </label>
                  <textarea
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleInputChange}
                    disabled={loading.submit}
                    rows={4}
                    className="form-control"
                    placeholder="Observações adicionais..."
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end pt-3 border-top">
              <button
                type="submit"
                disabled={loading.submit}
                className="btn btn-primary"
              >
                {loading.submit ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Salvando...
                  </>
                ) : (
                  'Salvar Checklist Completo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">Checklists Registrados</h5>
        </div>
        <div className="card-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}