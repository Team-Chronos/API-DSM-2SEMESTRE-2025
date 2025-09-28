import db from '../config/db.js';

export const criarCertPartEvento = async (req, res) => {
    const { id_colab, id_evento, data_part, duracao_part, descricao_part} = req.body;
    
    try {
        const query = 'INSERT INTO Certificado_Participacao (ID_Colaborador, ID_Evento, Data_Part, Duracao_Part, Descricao_Part) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [id_colab, id_evento, data_part, duracao_part, descricao_part]);

        res.status(201).json({ mensagem: "Participação cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar participação." });
    }
};

export const listarCertPartEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "select cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, e.* from Certificado_Participacao cert left join Evento e on e.id_evento = cert.id_evento where cert.ID_Colaborador = ?;";
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
        const query = "select cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, e.* from Certificado_Participacao cert left join Evento e on e.id_evento = cert.id_evento where cert.ID_Colaborador = ? and cert.ID_Evento = ?;";
        const [certPEventos] = await db.promise().query(query, [id_col, id_evento]);

        res.status(200).json(certPEventos[0]); 

    } catch (err) {
        console.error("Erro ao listar Participacao Evento:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
    }
}