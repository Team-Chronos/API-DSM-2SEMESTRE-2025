import api from "./api";

export const getHistoricoModalidade = async (colaboradorId: number) => {
  const response = await api.get(`/modalidades/historico/${colaboradorId}`);
  return response.data;
};

export const registrarModalidadeNoHistorico = async (colaboradorId: number, modalidade: string) => {
  let modalidadeCompleta = modalidade;
  if (modalidade === 'P') modalidadeCompleta = 'Presencial';
  if (modalidade === 'R') modalidadeCompleta = 'Remoto';
  if (modalidade === 'O') modalidadeCompleta = 'Outro';

  const response = await api.post("/modalidades/registrar", { 
    colaboradorId, 
    modalidade: modalidadeCompleta 
  });
  return response.data;
};