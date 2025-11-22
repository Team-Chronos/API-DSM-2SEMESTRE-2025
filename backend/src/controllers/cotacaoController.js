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

export async function cadastrarCotacao(req, res) {
  try {
    const {
      origem_uf,
      origem_cidade,
      destino_uf,
      destino_cidade,
      remetente,

      peso_carga,
      valor_carga,
      tipo_carga,

      pedagio,

      distancia_km,
      veiculo_id,

      drop_servico,

      imposto,
      total,
      custo,
      frete,
      liquido,
      margem
    } = req.body;

    const sql = `
      INSERT INTO wexpress_cotacoes (
        origem_uf, origem_cidade,
        destino_uf, destino_cidade,
        remetente,
        peso_carga, valor_carga, tipo_carga,
        pedagio,
        distancia_km,
        veiculo_id,
        drop_servico,
        imposto, total, custo, frete, liquido, margem
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      origem_uf,
      origem_cidade,
      destino_uf,
      destino_cidade,
      remetente,
      peso_carga,
      valor_carga,
      tipo_carga,
      pedagio,
      distancia_km,
      veiculo_id,
      drop_servico,
      imposto,
      total,
      custo,
      frete,
      liquido,
      margem
    ];

    const [result] = await db.promise().query(sql, params);

    return res.status(201).json({
      mensagem: "Cotação cadastrada com sucesso!",
      id: result.insertId
    });

  } catch (err) {
    console.error("Erro ao cadastrar cotação:", err);
    return res.status(500).json({ mensagem: "Erro ao cadastrar cotação." });
  }
}

export async function listarCotacoes(req, res) {
  try {
    const sql = "SELECT * FROM wexpress_cotacoes ORDER BY id DESC";

    const [rows] = await db.promise().query(sql);

    return res.status(200).json(rows);

  } catch (err) {
    console.error("Erro ao listar cotações:", err);
    return res.status(500).json({ mensagem: "Erro ao listar cotações." });
  }
}

export async function buscarCotacaoPorId(req, res) {
  try {
    const { id } = req.params;

    const sql = "SELECT * FROM wexpress_cotacoes WHERE id = ?";
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Cotação não encontrada." });
    }

    return res.status(200).json(rows[0]);

  } catch (err) {
    console.error("Erro ao buscar cotação:", err);
    return res.status(500).json({ mensagem: "Erro ao buscar cotação." });
  }
}

export async function deletarCotacao(req, res) {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM wexpress_cotacoes WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Cotação não encontrada." });
    }

    return res.status(200).json({ mensagem: "Cotação deletada com sucesso!" });

  } catch (err) {
    console.error("Erro ao deletar cotação:", err);
    return res.status(500).json({ mensagem: "Erro ao deletar cotação." });
  }
}