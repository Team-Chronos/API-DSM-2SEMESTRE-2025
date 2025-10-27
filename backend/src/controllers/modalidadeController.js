import HistoricoModalidade from '../models/historico.js';

export const historicoModalidades = async (req, res) => {
  const { colaboradorId } = req.params;
  try {
    const [historico] = await HistoricoModalidade.findByColaboradorId(colaboradorId);
    res.json(historico);
  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    res.status(500).json({ error: "Erro interno ao buscar histórico." });
  }
};

export const registrarModalidade = async (req, res) => {
  const { colaboradorId, modalidade } = req.body;
  if (!colaboradorId || !modalidade) {
    return res.status(400).json({ error: "ID do colaborador e modalidade são obrigatórios." });
  }
  try {
    await HistoricoModalidade.create({ colaboradorId, modalidade });
    res.status(201).json({ mensagem: "Modalidade registrada no histórico com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar modalidade:", err);
    res.status(500).json({ error: "Erro interno ao registrar modalidade." });
  }
};