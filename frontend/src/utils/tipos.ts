export interface Colaborador {
  ID_colaborador: number;
  Nome_Col: string;
  Email: string;
  Setor: number;
  Localidade: string;
  Telefone: string;
}

export interface Evento {
  ID_Evento: number;
  Nome_Evento: string;
  Data_Evento: string;
  Duracao_Evento: number;
  Local_Evento: string;
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
  Descricao: string;
  ID_Status: number;
  justificativa_notificacao?: string;
}

export interface Cliente {
  ID_Cliente: number;
  Nome_Cliente: string;
  Email_Cliente: string;
  Telefone_Cliente: string;
  Endereco: string;
  atividade: string;
  segmento_atuacao: string;
  depart_responsavel: string;
  Data_Cadastro: string;
  Etapa: string;
}

export type Tab = "colaboradores" | "eventos" | "cargos" | "cliente";