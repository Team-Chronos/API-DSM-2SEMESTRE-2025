import db from "../config/db.js";

export async function registrarChecklistPredial(req, res) {
  const {
    nome_responsavel,
    lixo_cozinha,
    lixo_reciclavel,
    cozinha_organizada,
    luzes_cozinha,
    cadeado_portao2,
    cadeado_portao1,
    torneiras_fechadas,
    lixo_banheiro,
    porta_banheiro,
    bebedouro_desligado,
    chaves_chaveiro,
    tv_cameras,
    tv_dashboard,
    ar_condicionado,
    luzes_operacional,
    luzes_armazem,
    cone_pcd,
    alarme,
    porta_armazem,
    cadeado_correntes,
    problemas_portao,
    situacao_atipica,
  } = req.body;

  try {
    const checklistData = {
      NomeFuncPredio: nome_responsavel,
      LixoCozinha: lixo_cozinha,
      LixoReciclavel: lixo_reciclavel,
      CozinhaOrganizada: cozinha_organizada,
      LuzesCozinha: luzes_cozinha,
      CadeadoPortao2: cadeado_portao2,
      CadeadoPortao1: cadeado_portao1,
      TorneirasFechadas: torneiras_fechadas,
      LixoBanheiro: lixo_banheiro,
      PortaBanheiro: porta_banheiro,
      BebedouroDesligado: bebedouro_desligado,
      ChavesChaveiro: chaves_chaveiro,
      TVCameras: tv_cameras,
      TVDashboard: tv_dashboard,
      ArCondicionado: ar_condicionado,
      LuzesOperacional: luzes_operacional,
      LuzesArmazem: luzes_armazem,
      ConePCD: cone_pcd,
      Alarme: alarme,
      PortaArmazem: porta_armazem,
      CadeadoCorrentes: cadeado_correntes,
      MotorRuidos: problemas_portao || null,
      SituacaoAtip: situacao_atipica || null,
    };

    const campos = Object.keys(checklistData).join(",");
    const valores = Object.values(checklistData);
    const placeholders = valores.map(() => "?").join(",");

    const query = `
      INSERT INTO ChecklistPredial (${campos})
      VALUES (${placeholders})
    `;

    await db.promise().query(query, valores);

    res.json({ mensagem: "Checklist predial registrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar checklist predial:", err);
    res
      .status(500)
      .json({ mensagem: "Erro interno ao registrar checklist predial" });
  }
}

export async function listarChecklistsPredial(req, res) {
  try {
    const query = `SELECT * FROM ChecklistPredial ORDER BY DataPredio DESC`;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao listar checklists prediais:", err);
    res
      .status(500)
      .json({ mensagem: "Erro interno ao listar checklists prediais" });
  }
}

export async function listarChecklistPredialPorId(req, res) {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM ChecklistPredial WHERE CheckPredio = ?`;
    const [result] = await db.promise().query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Checklist não encontrado." });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Erro ao buscar checklist predial por ID:", err);
    res.status(500).json({ mensagem: "Erro interno ao buscar checklist." });
  }
}
