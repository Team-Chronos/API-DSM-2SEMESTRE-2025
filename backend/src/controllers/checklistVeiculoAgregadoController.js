import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export async function registrarChecklist(req, res) {
  const {
    nome_motorista,
    cpf,
    placa_veiculo,
    tipo_veiculo,
    nivel_oleo,
    vazamento_oleo,
    nivel_agua,
    pne_liso,
    pte_liso,
    ptd_liso,
    pdd_liso,
    parabrisa_perfeito,
    cabine_externa_limpa,
    veiculo_externo_limpo,
    sem_amassado_ferrugem,
    assoalho_conservado,
    faixas_refletivas,
    parabrisa_funcionando,
    buzina_funciona,
    farol_alto,
    farol_baixo,
    setas_dianteiras,
    setas_traseiras,
    luz_freio,
    luz_re,
    sirene_re,
    extintor,
    step,
    triangulo,
    macaco,
    chave_roda,
    capacete_seguranca,
    colete_seguranca,
    bota_seguranca,
    nome_responsavel_vistoria,
  } = req.body;
  let { observacoes, id_responsavel_vistoria } = req.body;

  const files = req.files;

  try {
    const uploadPromises = Object.entries(files).map(async ([key, value]) => {
      const file = value[0];
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "checklistVeiculoAgregado",
      });
      await fs.unlink(file.path);
      return [key, uploadResult.secure_url];
    });

    const uploadedImages = Object.fromEntries(await Promise.all(uploadPromises));

    id_responsavel_vistoria = id_responsavel_vistoria === "outro" ? null : id_responsavel_vistoria
    observacoes = observacoes === "" ? null : observacoes

    const checklistData = {
      nome_motorista,
      cpf,
      placa_veiculo,
      tipo_veiculo,
      nivel_oleo,
      vazamento_oleo,
      nivel_agua,
      pne_liso,
      pte_liso,
      ptd_liso,
      pdd_liso,
      parabrisa_perfeito,
      cabine_externa_limpa,
      veiculo_externo_limpo,
      sem_amassado_ferrugem,
      assoalho_conservado,
      faixas_refletivas,
      parabrisa_funcionando,
      buzina_funciona,
      farol_alto,
      farol_baixo,
      setas_dianteiras,
      setas_traseiras,
      luz_freio,
      luz_re,
      sirene_re,
      extintor,
      step,
      triangulo,
      macaco,
      chave_roda,
      capacete_seguranca,
      colete_seguranca,
      bota_seguranca,
      observacoes,
      id_responsavel_vistoria,
      nome_responsavel_vistoria,
      ...uploadedImages,
    };

    const campos = Object.keys(checklistData).join(",");
    const valores = Object.values(checklistData);

    const placeholders = valores.map(() => "?").join(",");

    const query = `
      INSERT INTO checklistVeiculoAgregado (${campos})
      VALUES (${placeholders})
    `;

    await db.promise().query(query, valores);

    res.json({ mensagem: "Checklist registrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar checklist:", err);
    res.status(500).json({ mensagem: "Erro interno ao registrar checklist" });
  }
}

export async function listarResponsaveis(req, res) {
  try {
    const query = `
      SELECT col.Nome_col, rv.id_responsavel
      FROM responsaveisVistoria rv
      INNER JOIN colaboradores col
      ON col.ID_colaborador = rv.id_responsavel
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao listar Responsáveis pela vistoria:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Responsáveis pela vistoria." });
  }
}
