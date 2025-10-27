import db from '../config/db.js';

export const criarCertPartEvento = async (req, res) => {
    const { idColaborador, idEvento, dataPart, duracaoPart, descricaoPart } = req.body;

    if (!idColaborador || !idEvento) {
        return res.status(400).json({ mensagem: "ID_Colaborador e ID_Evento são obrigatórios!" });
    }

    try {
        const query = `
            INSERT INTO Certificado_Participacao 
            (ID_Colaborador, ID_Evento, Data_Part, Duracao_Part, Descricao_Part) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().query(query, [idColaborador, idEvento, dataPart, duracaoPart, descricaoPart]);

        res.status(201).json({ mensagem: "Participação cadastrada com sucesso!", id: result.insertId });

    } catch (err) {
        console.error("Erro ao cadastrar evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar participação." });
    }
};

export const listarCertPartEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT c.Nome_Col, cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, 
                   e.Nome_Evento, e.Descricao, e.Local_Evento
            FROM Certificado_Participacao cert
            LEFT JOIN Evento e ON e.ID_Evento = cert.ID_Evento
            LEFT JOIN Colaboradores c ON c.ID_Colaborador = cert.ID_Colaborador
            WHERE cert.ID_Colaborador = ?;
        `;
        const [certPEventos] = await db.promise().query(query, [id]);

        res.status(200).json(certPEventos); 

    } catch (err) {
        console.error("Erro ao listar Participação Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar Participação Evento." });
    }
};

export const obterCertPartEventoPorID = async (req, res) => {
    const { idColaborador, idEvento } = req.params;

    if (!idColaborador || !idEvento) {
        return res.status(400).json({ mensagem: "ID_Colaborador e ID_Evento são obrigatórios!" });
    }

    try {
        const query = `
            SELECT c.Nome_Col, cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, 
                   e.Nome_Evento, e.Descricao, e.Local_Evento
            FROM Certificado_Participacao cert
            LEFT JOIN Evento e ON e.ID_Evento = cert.ID_Evento
            LEFT JOIN Colaboradores c ON c.ID_Colaborador = cert.ID_Colaborador
            WHERE cert.ID_Colaborador = ? AND cert.ID_Evento = ?;
        `;
        const [certPEvento] = await db.promise().query(query, [idColaborador, idEvento]);

        if (certPEvento.length === 0) {
            return res.status(404).json({ mensagem: "Participação não encontrada." });
        }

        res.status(200).json(certPEvento[0]); 

    } catch (err) {
        console.error("Erro ao obter Participação Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao obter Participação Evento." });
    }
};
