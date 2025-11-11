export interface Colaborador {
  ID_colaborador: number;
  Nome_Col: string;
  Email: string;
  Setor: number;
  ID_cargo: number;
  Localidade: string;
  Telefone: string;
}
export interface Cargos {
  ID_Cargo: number;
  Nome_Cargo: string;
  Nivel_Acesso: string;
}

export interface Evento {
  ID_Evento: number;
  Nome_Evento: string;
  Data_Evento: string;
  Duracao_Evento: number;
  Local_Evento: string;
  ID_Tipo_Evento: number;
  Descricao: string;
  criado_em: string;
  atualizado_em: string;
  participantes?: number[];
}

export interface User {
  id: number;
  nome: string;
  setor: number;
  id_cargo: number;
  nivel_acesso: string;
}

export interface Notificacao {
  ID_Evento: number;
  Nome_Evento: string;
  Data_Evento: string;
  Duracao_Evento: number;
  Local_Evento: string;
  ID_Tipo_Evento: number;
  Descricao: string;
  ID_Status: number;
  justificativa_notificacao?: string;
}
export type Certificado = {
  id: number
  ID_colaborador: number
  Nome_Evento: string
  Url_Pdf: string
  Data_Part: string
  Duracao_Evento: string
  Descricao?: string
  Local_Evento: string
};
export interface HistoricoModalidade {
  id: number;
  modalidade: string;
  criado_em: string;
}
export type Tab = "colaboradores" | "eventos" | "cargos" | "certificado" | "cliente" | "relatórios";

export interface Cliente {
  ID_Cliente: number;
  Nome_Cliente: string;
  Email_Cliente: string;
  Telefone_Cliente: string;
  Cidade: string;
  atividade: string;
  Segmento: string;
  depart_responsavel: string;
  criado_em: string;
  Etapa: string;
}

export const tp_tipo_evento = {
  1: "Feira",
  2: "Workshop",
  3: "Reunião",
};

export const tp_setor = {
  1: "Administrativo",
  2: "Comercial",
  3: "Operacional"
}

export type HistoricoTabs = "Veículo Agregado" | "Fechamento Predial"