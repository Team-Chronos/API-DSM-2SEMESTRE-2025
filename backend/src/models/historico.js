import db from '../config/db.js';

const HistoricoModalidade = {
  findByColaboradorId: (colaboradorId) => {
    const query = `
      SELECT id, modalidade, data_resposta 
      FROM historico_modalidade 
      WHERE colaborador_id = ? 
      ORDER BY data_resposta DESC
    `;
    return db.promise().query(query, [colaboradorId]);
  },

  create: (data) => {
    const { colaboradorId, modalidade } = data;
    const query = "INSERT INTO historico_modalidade (colaborador_id, modalidade) VALUES (?, ?)";
    return db.promise().query(query, [colaboradorId, modalidade]);
  }
};

export default HistoricoModalidade;