import db from '../config/db.js';
import Cliente from '../models/cliente.js';

export async function criarCliente(req, res) {
    const { 
        nome, email, telefone, 
        segmento, 
        cidade,
        criadoPor 
    } = req.body;

    if (!nome || !segmento ) { 
        return res.status(400).json({ mensagem: "Nome e Segmento são obrigatórios." });
    }

    try {
        if (typeof Cliente.create !== 'function') {
             console.error("Erro: Método Cliente.create não encontrado ou inválido no modelo.");
             return res.status(500).json({ mensagem: "Erro interno no servidor (modelo)." });
        }
        await Cliente.create({ 
            nome, 
            email, 
            telefone, 
            segmento, 
            cidade,
            criadoPor 
         });
        res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar cliente:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar cliente." });
    }
}


export async function listarClientes(req, res){
  try {
    const query = "SELECT ID_Cliente, Nome_Cliente, Telefone_Cliente, Email_Cliente, Segmento, Cidade, Ultima_Interacao, Criado_Por, criado_em FROM Cliente"; 
    const [clientes] = await db.promise().query(query);
    res.status(200).json(clientes); 
  } catch (err) {
    console.error("Erro ao listar clientes:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar clientes." });
  }
}

export async function listarClientePorId(req, res) {
    try{
        if (typeof Cliente.findById !== 'function') {
             console.error("Erro: Método Cliente.findById não encontrado no modelo.");
             return res.status(500).json({ mensagem: "Erro interno no servidor (modelo)." });
        }
        const [result] = await Cliente.findById(req.params.id)
        if (result.length === 0) return res.status(404).json({ mensagem: "Cliente não encontrado." });
        res.json(result[0]);
    } catch (err) {
        console.error("Erro ao buscar cliente por ID:", err); 
        res.status(500).json({ mensagem: "Erro ao buscar cliente." });
    }
}

export async function listarCidades(req, res) {
    console.log("Recebido pedido GET /api/clientes/cidades");
    try {
        const query = "SELECT DISTINCT Cidade FROM Cliente WHERE Cidade IS NOT NULL AND Cidade <> '' ORDER BY Cidade"; 
        const [cidadesResult] = await db.promise().query(query);
        
        const cidades = cidadesResult.map(row => row.Cidade);
        
        console.log("Cidades encontradas:", cidades);
        res.status(200).json(cidades);

    } catch (err) {
        console.error("Erro detalhado ao listar cidades:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar cidades." });
    }
}

export async function listarSegmentos(req, res) {
    console.log("Recebido pedido GET /api/clientes/segmentos");
    try {
        const query = "SELECT DISTINCT Segmento FROM Cliente WHERE Segmento IS NOT NULL AND Segmento <> '' ORDER BY Segmento"; 
        const [segmentosResult] = await db.promise().query(query);
        
        const segmentos = segmentosResult.map(row => row.Segmento); 
        
        console.log("Segmentos encontrados:", segmentos);
        res.status(200).json(segmentos);

    } catch (err) {
        console.error("Erro detalhado ao listar segmentos:", err);
        res.status(500).json({ mensagem: "Erro interno ao listar segmentos." });
    }
}

