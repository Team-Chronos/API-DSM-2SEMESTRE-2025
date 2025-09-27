import db from '../config/db.js';

const Evento = {
    create: (data) => {
        const { titulo, descricao, data_evento, local, criado_por } = data;
        const query = "INSERT INTO Eventos (titulo, descricao, data_evento, local, criado_por) VALUES (?, ?, ?, ?, ?)";
        return db.promise().query(query, [titulo, descricao, data_evento, local, criado_por]);
    },

    findAll: () => {
        const query = "SELECT * FROM Eventos ORDER BY data_evento DESC";
        return db.promise().query(query);
    },

    findById: (id) => {
        const query = "SELECT * FROM Eventos WHERE id = ?";
        return db.promise().query(query, [id]);
    },

    findBySetor: (setor) => {
        const query = "SELECT Email, Nome_Col FROM Colaboradores WHERE Setor = ? AND verified = true";
        return db.promise().query(query, [setor]);
    },

    findAllColaboradores: () => {
        const query = "SELECT Email, Nome_Col, Setor FROM Colaboradores WHERE verified = true";
        return db.promise().query(query);
    }
};

export default Evento;