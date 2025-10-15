import db from '../config/db.js';
import Cliente from '../models/cliente.js'; 

export async function criarCliente(req, res) {
    const { 
        nome, 
        email, 
        telefone, 
        endereco, 
        atividade, 
        segmento_atuacao, 
        depart_responsavel 
    } = req.body;

    if (!nome || !email || !endereco || !atividade) {
        return res.status(400).json({ mensagem: "Os campos obrigatórios devem ser preenchidos." });
    }

    try {
        const [emailResults] = await Cliente.findByEmail(email);
        if (emailResults.length > 0) {
            return res.status(400).json({ mensagem: "Este email já está cadastrado." });
        }

        await Cliente.create({ 
            nome, 
            email, 
            telefone, 
            endereco, 
            atividade, 
            segmento_atuacao, 
            depart_responsavel 
        });

        res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar cliente:", err);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar cliente." });
    }
}


export async function listarClientes(req, res){
  try {
    const query = "SELECT * FROM Cliente";
    const [clientes] = await db.promise().query(query);

    res.status(200).json(clientes); 

  } catch (err) {
    console.error("Erro ao listar clientes:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar clientes." });
  }
}

export async function listarClientePorId(req, res) {
	try{
		const [result] = await Cliente.findById(req.params.id)
		if (result.length === 0) return res.status(404).json({ mensagem: "Cliente não encontrado." });
			res.json(result[0]);
	} catch (err) {
		res.status(500).json({ mensagem: "Erro ao buscar cliente." });
	}
}