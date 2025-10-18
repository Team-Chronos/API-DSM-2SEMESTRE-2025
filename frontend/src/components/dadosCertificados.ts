import { type Certificado } from "../utils/tipos";

export const todosOsCertificados: Certificado[] = [
  {
    id: 1,
    ID_colaborador: 1,
    Nome_Evento: "teste",
    Url_Pdf: "/certificados/teste1.pdf",
    Data_Part: "2025-09-20T00:00:00.000Z",
    Duracao_Evento: "40 horas",
    Descricao: "Curso focado em hooks avançados e performance.",
    Local_Evento: "Online",
  },
  {
    id: 2,
    ID_colaborador: 1, 
    Nome_Evento: "teste2",
    Url_Pdf: "/certificados/teste2.pdf",
    Data_Part: "2025-07-25T00:00:00.000Z",
    Duracao_Evento: "1 hora",
    Descricao: "Alinhamento estratégico do terceiro trimestre.",
    Local_Evento: "Presencial",
  },

  {
    id: 3,
    ID_colaborador: 2, 
    Nome_Evento: "teste3",
    Url_Pdf: "/certificados/teste3.pdf", 
    Data_Part: "2025-10-05T00:00:00.000Z",
    Duracao_Evento: "20 horas",
    Descricao: "Fundamentos de segurança para equipes de desenvolvimento.",
    Local_Evento: "Online",
  },
  {
    id: 4,
    ID_colaborador: 2, 
    Nome_Evento: "teste4",
    Url_Pdf: "/certificados/teste4.pdf",
    Data_Part: "2025-08-15T00:00:00.000Z",
    Duracao_Evento: "16 horas",
    Descricao: "Workshop prático sobre APIs REST com Express.",
    Local_Evento: "Online",
  },
];