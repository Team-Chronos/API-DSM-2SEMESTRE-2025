import db from '../config/db.js';

export async function getVeiculos(req, res){
  try{
    const query = "SELECT * FROM wexpress;"
    const [vei] = await db.promise().query(query);

    res.status(200).json(vei)
  } catch (err) {
    console.error("Erro ao listar veículos WExpress:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar veículos WExpress." });
  }
}