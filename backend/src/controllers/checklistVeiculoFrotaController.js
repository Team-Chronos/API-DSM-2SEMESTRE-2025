import db from "../config/db.js";

export async function registrarChecklistFrota(req, res) {
  const {
    id_motorista,
    nome_motorista,
    placa,
    km_inicial,
    km_final,
    destino,
    abastecimento,
    comprovante_enviado,
    oleo_motor,
    reservatorio_agua,
    sistema_eletrico,
    estado_pneus,
    limpeza_bau_sider_cabine,
    lubrificacao_suspensoes,
    macaco,
    chave_roda,
    documento_vigente,
    data_encerramento_atividade,
    observacoes,
  } = req.body;

  try {
    let motoristaIdFinal = null;

    if (id_motorista && id_motorista !== "outro") {
      motoristaIdFinal = Number(id_motorista);
    }

    if (id_motorista === "outro") {
      if (!nome_motorista || nome_motorista.trim() === "") {
        return res.status(400).json({
          mensagem:
            "Nome do motorista é obrigatório quando selecionado 'outro'.",
        });
      }

      const [existe] = await db
        .promise()
        .query("SELECT id_motorista FROM motorista WHERE nome_motorista = ?", [
          nome_motorista,
        ]);

      if (existe.length > 0) {
        motoristaIdFinal = existe[0].id_motorista;
      } else {
        const [novo] = await db
          .promise()
          .query("INSERT INTO motorista (nome_motorista) VALUES (?)", [
            nome_motorista,
          ]);
        motoristaIdFinal = novo.insertId;
      }
    }

    const checklistData = {
      id_motorista: motoristaIdFinal,
      placa,
      km_inicial: Number(km_inicial),
      km_final: Number(km_final),
      destino,
      abastecimento,
      comprovante_enviado,
      oleo_motor,
      reservatorio_agua,
      sistema_eletrico,
      estado_pneus,
      limpeza_bau_sider_cabine,
      lubrificacao_suspensoes,
      macaco,
      chave_roda,
      documento_vigente,
      data_encerramento_atividade,
      observacoes: observacoes || null,
    };

    const campos = Object.keys(checklistData).join(",");
    const valores = Object.values(checklistData);
    const placeholders = valores.map(() => "?").join(",");

    const query = `
      INSERT INTO checklistVeiculoFrota (${campos})
      VALUES (${placeholders})
    `;

    await db.promise().query(query, valores);

    res.json({ mensagem: "Checklist da frota registrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar checklist:", err);
    res.status(500).json({ mensagem: "Erro interno ao registrar checklist." });
  }
}

export async function listarChecklistsVeiculoFrota(req, res) {
  try {
    const query = `SELECT cvf.*, m.nome_motorista FROM checklistVeiculoFrota cvf left join motorista m on m.id_motorista = cvf.id_motorista ORDER BY cvf.criado_em DESC;`;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao listar checklists de veículo frota:", err);
    res
      .status(500)
      .json({
        mensagem: "Erro interno ao listar checklists de veículo frota.",
      });
  }
}

export async function listarChecklistFrotaPorId(req, res) {
  const { id } = req.params;

  try {
    const query = `
      SELECT cvf.*, m.nome_motorista AS nome_motorista_vinculado
      FROM checklistVeiculoFrota cvf
      LEFT JOIN motorista m ON m.id_motorista = cvf.id_motorista
      WHERE cvf.id_cvf = ?;
    `;

    const [result] = await db.promise().query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Checklist não encontrado." });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Erro ao buscar checklist da frota:", err);
    res.status(500).json({ mensagem: "Erro interno ao buscar checklist." });
  }
}

export async function listarMotoristas(req, res) {
  try {
    const [result] = await db.promise().query(`
      SELECT * FROM motorista ORDER BY nome_motorista;
    `);

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao listar motoristas:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar motoristas." });
  }
}
