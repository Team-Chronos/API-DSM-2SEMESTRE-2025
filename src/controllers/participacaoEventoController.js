import db from '../config/db.js';

export const listarParticipacaoEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const query = "select pe.ID_Status, e.* from participacao_evento pe left join Evento e on e.id_evento = pe.id_evento where pe.ID_Colaborador = ?;";
        const [pEventos] = await db.promise().query(query, [id]);

        res.status(200).json(pEventos); 

    } catch (err) {
        console.error("Erro ao listar Participacao Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
    }
};

export const atualizarParticipacaoEvento = async (req, res) => {
    const { id_col, id_evento } = req.params;
    const { status, justificativa_notificacao } = req.body

    try {
        let result
        if (justificativa_notificacao){
            const query = "update participacao_evento set ID_Status = ?, justificativa = ? where id_colaborador = ? and id_evento = ?";
            [result] = await db.promise().query(query, [status, justificativa_notificacao, id_col, id_evento]);
        } else {
            const query = "update participacao_evento set ID_Status = ? where id_colaborador = ? and id_evento = ?";
            [result] = await db.promise().query(query, [status, id_col, id_evento]);
        }

        res.status(200).json({ mensagem: "Atualizado com sucesso", result });

    } catch (err) {
        console.error("Erro ao atualizar o status de participação", err);
        res.status(500).json({ mensagem: "Erro interno ao atualizar o status de participação" });
    }
}