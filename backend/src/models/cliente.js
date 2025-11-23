import db from '../config/db.js';

class Cliente {
    static async create(dadosCliente) {
        const {
            nome,      
            email,      
            telefone,
            atividade,  
            segmento,   
            cidade,     
            criadoPor,
            depart_responsavel  
        } = dadosCliente;

        const sql = `
            INSERT INTO Cliente 
            (Nome_Cliente, Email_Cliente, Telefone_Cliente, atividade, Segmento, Cidade, Criado_Por, depart_responsavel) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nome,
            email,     
            telefone,
            atividade,   
            segmento,
            cidade,     
            criadoPor,
            depart_responsavel   
        ];

        console.log("Executando SQL:", sql, values); 

        try {
             const [result] = await db.promise().query(sql, values);
             console.log("Resultado Insert:", result); 
             return result;
        } catch (error) {
             console.error("Erro no modelo Cliente.create:", error); 
             throw error; 
        }
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