import db from '../config/db.js';

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