import db from '../config/db.js';

export const criarCertPartEvento = async (req, res) => {
    const { id_colab, id_evento, objetivo, principais_infos, aplicacoes_newe, referencias, avaliacao, comentarios} = req.body;
    
    try {
        const query = 'INSERT INTO Certificado_Participacao VALUES (?, ?, ?, ?, ?, ?, ?, ?, default)';
        const [result] = await db.promise().query(query, [id_colab, id_evento, objetivo, principais_infos, aplicacoes_newe, referencias, avaliacao, comentarios]);

        res.status(201).json({ mensagem: "Participação cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar participação evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar participação." });
    }
};

export const listarCertPartEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `select c.Nome_Col, cert.Data_Part, e.Duracao_Evento, cert.Descricao_Part, e.Nome_Evento, e.Descricao, e.Local_Evento from Certificado_Participacao cert
left join Evento e on e.id_evento = cert.id_evento
left join Colaboradores c on c.id_colaborador = cert.id_Colaborador
where cert.ID_Colaborador = ?;`;
        const [certPEventos] = await db.promise().query(query, [id]);

        res.status(200).json(certPEventos); 

    } catch (err) {
        console.error("Erro ao listar Participacao Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
    }
};

export const obterCertPartEventoPorID = async (req, res) => {
    const { id_col, id_evento } = req.params;

    try {
        const query = `select c.Nome_Col, cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, e.Nome_Evento, e.Descricao, e.Local_Evento from Certificado_Participacao cert
left join Evento e on e.id_evento = cert.id_evento
left join Colaboradores c on c.id_colaborador = cert.id_Colaborador
where cert.ID_Colaborador = ? and cert.ID_Colaborador = ?;`;
        const [certPEventos] = await db.promise().query(query, [id_col, id_evento]);

        res.status(200).json(certPEventos[0]); 

    } catch (err) {
        console.error("Erro ao listar Participacao Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
    }
}