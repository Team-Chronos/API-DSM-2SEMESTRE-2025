import db from '../config/db.js';

class Cliente {
    /**
     * CORRIGIDO: Insere um novo cliente usando as colunas atuais da BD.
     */
    static async create(dadosCliente) {
        const {
            nome,       // Mapeia para Nome_Cliente
            email,      // Mapeia para Email_Cliente
            telefone,   // Mapeia para Telefone_Cliente
            segmento,   // Mapeia para Segmento
            cidade,     // Mapeia para Cidade
            criadoPor   // Mapeia para Criado_Por
        } = dadosCliente;

        // CORRIGIDO: Query INSERT com as colunas corretas da tabela Cliente atual
        const sql = `
            INSERT INTO Cliente 
            (Nome_Cliente, Email_Cliente, Telefone_Cliente, Segmento, Cidade, Criado_Por) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // CORRIGIDO: Valores na ordem correta da query
        const values = [
            nome,
            email,      // Será NULL se não for fornecido e a coluna permitir
            telefone,   // Será NULL se não for fornecido e a coluna permitir
            segmento,
            cidade,     // Será NULL se não for fornecido e a coluna permitir
            criadoPor   // ID do colaborador que criou (pode ser NULL se a coluna permitir)
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
        // Assume que a coluna Email_Cliente existe
        const sql = "SELECT * FROM Cliente WHERE Email_Cliente = ?"; 
        try {
            const [rows] = await db.promise().query(sql, [email]);
            return [rows]; 
        } catch (error) {
             console.error("Erro no modelo Cliente.findByEmail:", error);
             throw error;
        }
    }
    
    /**
     * Busca cliente pelo ID.
     */
    static async findById(id) {
        const sql = "SELECT * FROM Cliente WHERE ID_Cliente = ?";
         try {
            const [rows] = await db.promise().query(sql, [id]);
            return [rows]; 
        } catch (error) {
             console.error("Erro no modelo Cliente.findById:", error);
             throw error;
        }
    }

}

export default Cliente;

