import db from '../config/db.js';

class Cliente {
    static async create(dadosCliente) {
        const {
            nome,
            email,
            telefone,
            endereco,
            atividade,
            segmento_atuacao,
            depart_responsavel
        } = dadosCliente;

        const sql = `
            INSERT INTO Cliente 
            (Nome_Cliente, Email_Cliente, Telefone_Cliente, Endereco, atividade, segmento_atuacao, depart_responsavel) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nome,
            email,
            telefone,
            endereco,
            atividade,
            segmento_atuacao,
            depart_responsavel
        ];

        return db.promise().query(sql, values);
    }

    static async findByEmail(email) {
        const sql = "SELECT * FROM Cliente WHERE Email_Cliente = ?";
        return db.promise().query(sql, [email]);
    }
    
    static async findById(id) {
        const sql = "SELECT * FROM Cliente WHERE ID_Cliente = ?";
        return db.promise().query(sql, [id]);
    }
    static async updateEtapa(id, etapa) {
    const sql = "UPDATE Cliente SET Etapa = ? WHERE ID_Cliente = ?";
    return db.promise().query(sql, [etapa, id]);
}


}

export default Cliente;