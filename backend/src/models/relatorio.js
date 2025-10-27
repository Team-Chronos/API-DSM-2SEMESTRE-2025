import db from '../config/db.js';

class Relatorio {
    static async create(dadosRelatorio) {
        const {
            nome,
            tipo,
            geradoPor,
        } = dadosRelatorio;

        const sql = `
            INSERT INTO Relatorio 
            (Nome_Relatorio, Tipo_Relatorio, Gerado_Por, Data_Geracao) 
            VALUES (?, ?, ?, NOW())
        `;

        const values = [
            nome,
            tipo,
            geradoPor,
        ];

        return db.promise().query(sql, values);
    }

    static async findAll() {
        const query = `
          SELECT 
            r.ID_Relatorio,
            r.Nome_Relatorio,
            r.Tipo_Relatorio,
            r.Data_Geracao,
            c.Nome_Col AS Gerado_Por
          FROM Relatorio r
          LEFT JOIN Colaboradores c ON r.Gerado_Por = c.ID_colaborador
          ORDER BY r.Data_Geracao DESC
        `;
        return db.promise().query(query);
    }
    
    static async findById(id) {
        const sql = "SELECT * FROM Relatorio WHERE ID_Relatorio = ?";
        return db.promise().query(sql, [id]);
    }

    static async deleteById(id) {
        const sql = "DELETE FROM Relatorio WHERE ID_Relatorio = ?";
        return db.promise().query(sql, [id]);
    }
}

export default Relatorio;