import db from '../config/db.js';

class Relatorio {
    /**
     @param {object} dadosRelatorio
     @param {string} dadosRelatorio.nome 
     @param {string} dadosRelatorio.geradoPor 
     @param {string} [dadosRelatorio.url]
     @returns {Promise}
    */
    
    static async create(dadosRelatorio) {
        const {
            nome,
            tipo,
            geradoPor,
            url
        } = dadosRelatorio;

        const sql = `
            INSERT INTO Relatorio 
            (Nome_Relatorio, Tipo_Relatorio, Gerado_Por, URL_Relatorio, Data_Geracao) 
            VALUES (?, ?, ?, ?, NOW())
        `;

        const values = [
            nome,
            tipo,
            geradoPor,
            url,
        ];

        return db.promise().query(sql, values);
    }

    /**
     * @returns {Promise} 
     */
    static async findAll() {
        const sql = "SELECT * FROM Relatorio ORDER BY Data_Geracao DESC";
        return db.promise().query(sql);
    }
    
    /**
     * @param {number} id
     * @returns {Promise}
     */
    static async findById(id) {
        const sql = "SELECT * FROM Relatorio WHERE ID_Relatorio = ?";
        return db.promise().query(sql, [id]);
    }
}

export default Relatorio;
