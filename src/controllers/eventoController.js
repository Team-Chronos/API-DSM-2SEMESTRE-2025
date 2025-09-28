import db from '../config/db.js';

export const criarEvento = async (req, res) => {
    const {nome_evento, data_evento, local_evento, descricao_evento, participantes} = req.body;

    if (!nome_evento || !data_evento) {
        return res.status(400).json({ mensagem: "O nome e a data do evento são obrigatórios!" });
    }

    try {
        const query = 'INSERT INTO Evento (Nome_Evento, Data_Evento, Local_Evento, Descricao) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [nome_evento, data_evento, local_evento, descricao_evento]);
        await participantes.forEach(async (id_colaborador) => {
            await db.promise().query( 'INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES ((SELECT ID_Evento FROM Evento WHERE ID_Evento = LAST_INSERT_ID()), ?, 1)', [id_colaborador]);
        });
        

        res.status(201).json({ mensagem: "Evento cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar evento." });
    }
};

export const listarEventos = async (req, res) => {
    try {
        const query = "SELECT * FROM Evento ORDER BY Data_Evento DESC";
        const [eventos] = await db.promise().query(query);

        res.status(200).json(eventos); 

    } catch (err) {
        console.error("Erro ao listar eventos:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar eventos." });
    }
};

export const getEventoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = "SELECT * FROM Evento WHERE ID_Evento = ?";
        const [eventos] = await db.promise().query(query, [id]);
        if (eventos.length === 0) {
            return res.status(404).json({ mensagem: "Evento não encontrado." });
        }
        res.status(200).json(eventos[0]);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro interno ao buscar evento." });
    }
};

export const atualizarEvento = async (req, res) => {
    const { id } = req.params;
    const {nome_evento, data_evento, local_evento, descricao_evento, participantes} = req.body;
    if (!nome_evento || !data_evento) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }
    try {
        const query = "UPDATE Evento SET Nome_Evento = ?, Data_Evento = ?, local_evento = ?, descricao = ? WHERE ID_Evento = ?";
        const [result] = await db.promise().query(query, [nome_evento, data_evento, local_evento, descricao_evento, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Evento não encontrado." });
        }
        res.status(200).json({ mensagem: "Evento atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro interno ao atualizar evento." });
    }
};

export const excluirEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM Evento WHERE ID_Evento = ?";
        const [result] = await db.promise().query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Evento não encontrado." });
        }
        res.status(200).json({ mensagem: "Evento excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro interno ao excluir evento." });
    }
};
export const salvarLocalidade = async (req, res) => {
    const { colaboradorId, localidade } = req.body;

    if (!colaboradorId || !localidade) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    try {
        await Colaborador.updateLocalidade(colaboradorId, localidade);
        res.status(200).json({ mensagem: "Localidade salva com sucesso!" });
    } catch (err) {
        console.error("Erro ao salvar localidade:", err);
        res.status(500).json({ mensagem: "Erro interno ao salvar localidade." });
    }
};