import db from "../config/db.js";

const HistoricoModalidade = {
  findByColaboradorId: (colaboradorId) => {
    const query = `
      SELECT id, modalidade, criado_em 
      FROM historico_modalidade 
      WHERE colaborador_id = ? 
      ORDER BY criado_em DESC
    `;
    return db.promise().query(query, [colaboradorId]);
  },

  create: (data) => {
    const { colaboradorId, modalidade } = data;
    const query =
      "INSERT INTO historico_modalidade (colaborador_id, modalidade) VALUES (?, ?)";
    return db.promise().query(query, [colaboradorId, modalidade]);
  },
};

export default HistoricoModalidade;
