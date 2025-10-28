import db from '../config/db.js';

class Cliente {
    static async create(dadosCliente) {
        const {
            nome,       // Mapeia para Nome_Cliente
            email,      // Mapeia para Email_Cliente
            telefone,
            atividade,   // Mapeia para Telefone_Cliente
            segmento,   // Mapeia para Segmento
            cidade,     // Mapeia para Cidade
            criadoPor,
            depart_responsavel   // Mapeia para Criado_Por
        } = dadosCliente;

        // CORRIGIDO: Query INSERT com as colunas corretas da tabela Cliente atual
        const sql = `
            INSERT INTO Cliente 
            (Nome_Cliente, Email_Cliente, Telefone_Cliente, atividade, Segmento, Cidade, Criado_Por, depart_responsavel) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // CORRIGIDO: Valores na ordem correta da query
        const values = [
            nome,
            email,      // Será NULL se não for fornecido e a coluna permitir
            telefone,
            atividade,   // Será NULL se não for fornecido e a coluna permitir
            segmento,
            cidade,     // Será NULL se não for fornecido e a coluna permitir
            criadoPor,
            depart_responsavel   // ID do colaborador que criou (pode ser NULL se a coluna permitir)
        ];

        console.log("Executando SQL:", sql, values); // Log para depuração

        // Executa a query
        try {
             const [result] = await db.promise().query(sql, values);
             console.log("Resultado Insert:", result); // Log
             return result;
        } catch (error) {
             console.error("Erro no modelo Cliente.create:", error); // Log
             throw error; // Re-lança o erro para o controller tratar
        }
    }

    /**
     * Busca cliente pelo email (se a coluna Email_Cliente existir).
     */
   static async findByEmail(email) {
        const sql = "SELECT * FROM Cliente WHERE Email_Cliente = ?";
        return db.promise().query(sql, [email]);
    }
    
    /**
     * Busca cliente pelo ID.
     */
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