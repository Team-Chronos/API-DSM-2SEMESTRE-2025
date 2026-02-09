import db from "../config/db.js";

export const listarParticipacaoEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const query =
      "SELECT pe.ID_Status, pe.justificativa, e.* FROM Participacao_Evento pe LEFT JOIN Evento e ON e.ID_Evento = pe.ID_Evento WHERE pe.ID_Colaborador = ?;";
    
    const [pEventos] = await db.promise().query(query, [id]);

    res.status(200).json(pEventos);
  } catch (err) {
    console.error("Erro ao listar Participacao Evento:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
  }
};

export const atualizarParticipacaoEvento = async (req, res) => {
  const { id_col, id_evento } = req.params;
  const { status, justificativa_notificacao } = req.body;

  if (isNaN(status)) {
     return res.status(400).json({ mensagem: "O status deve ser o ID numérico (ex: 1, 2, 3)." });
  }

  try {
    let result;
    if (justificativa_notificacao) {
      const query =
        "UPDATE Participacao_Evento SET ID_Status = ?, justificativa = ? WHERE ID_Colaborador = ? AND ID_Evento = ?";
      [result] = await db
        .promise()
        .query(query, [status, justificativa_notificacao, id_col, id_evento]);
    } else {
      const query =
        "UPDATE Participacao_Evento SET ID_Status = ? WHERE ID_Colaborador = ? AND ID_Evento = ?";
      [result] = await db.promise().query(query, [status, id_col, id_evento]);
    }

    if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Participação não encontrada para atualizar." });
    }

    res.status(200).json({ mensagem: "Atualizado com sucesso", result });
  } catch (err) {
    console.error("Erro ao atualizar o status de participação", err);
    res.status(500).json({ mensagem: "Erro interno ao atualizar o status de participação" });
  }
};

export const obterParticipacaoEventoPorID = async (req, res) => {
  const { id_col, id_evento } = req.params;

  try {
    const query =
      "SELECT pe.ID_Status, pe.justificativa, e.* FROM Participacao_Evento pe LEFT JOIN Evento e ON e.ID_Evento = pe.ID_Evento WHERE pe.ID_Colaborador = ? AND pe.ID_Evento = ?;";
    const [pEventos] = await db.promise().query(query, [id_col, id_evento]);

    if (pEventos.length === 0) {
        return res.status(404).json({ mensagem: "Participação não encontrada." });
    }

    res.status(200).json(pEventos[0]);
  } catch (err) {
    console.error("Erro ao listar Participacao Evento:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
  }
};