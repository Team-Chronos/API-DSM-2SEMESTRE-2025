import db from '../config/db.js';
import Cliente from '../models/cliente.js';

export async function criarCliente(req, res) {
    const { 
        nome, email, telefone, endereco, atividade, segmento_atuacao, depart_responsavel 
    } = req.body;

    if (!nome || !email || !endereco || !atividade) {
        return res.status(400).json({ mensagem: "Os campos obrigatórios devem ser preenchidos." });
    }

    try {
        if (typeof Cliente.findByEmail !== 'function') {
             console.error("Erro: Método Cliente.findByEmail não encontrado no modelo.");
             return res.status(500).json({ mensagem: "Erro interno no servidor (modelo)." });
        }
        const [emailResults] = await Cliente.findByEmail(email);
        if (emailResults.length > 0) {
            return res.status(400).json({ mensagem: "Este email já está cadastrado." });
        }

        if (typeof Cliente.create !== 'function') {
             console.error("Erro: Método Cliente.create não encontrado no modelo.");
             return res.status(500).json({ mensagem: "Erro interno no servidor (modelo)." });
        }
        await Cliente.create({ nome, email, telefone, endereco, atividade, segmento_atuacao, depart_responsavel });
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
        const query = "SELECT DISTINCT Endereco FROM Cliente WHERE Endereco IS NOT NULL AND Endereco <> ''";
        const [clientes] = await db.promise().query(query);
        console.log(`Encontrados ${clientes.length} endereços distintos.`); 

        const cidades = new Set(); 

        clientes.forEach(cliente => {
            const endereco = cliente.Endereco;
            if (!endereco) return;

            const parts = endereco.split(',').map(part => part.trim());
            const ultimaParte = parts[parts.length - 1];
            
            if (ultimaParte) {
                let cidadePotencial = ultimaParte.split(' - ')[0].trim();

                cidadePotencial = cidadePotencial.replace(/^\d{5}-\d{3}\s*/, '').trim();

                if (cidadePotencial && 
                    cidadePotencial.length > 2 && 
                    !/^\d+$/.test(cidadePotencial) &&
                    /[a-zA-Z]/g.test(cidadePotencial))
                {
                    const cidadeFormatada = cidadePotencial.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    cidades.add(cidadeFormatada);
                } else {
                     console.warn(`Cidade potencial "${cidadePotencial}" filtrada do endereço: "${endereco}"`);
                }
            } else {
                 console.warn(`Não foi possível extrair a última parte de: "${endereco}"`); 
            }
        });

        const cidadesArray = Array.from(cidades).sort();
        console.log("Cidades extraídas (lógica simplificada):", cidadesArray); 
        res.status(200).json(cidadesArray);

    } catch (err) {
        console.error("Erro detalhado ao listar cidades:", err); 
        res.status(500).json({ mensagem: "Erro interno ao listar cidades." });
    }
}

