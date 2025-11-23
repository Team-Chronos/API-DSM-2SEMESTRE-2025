import db from "../config/db.js";

export const criarCertPartEvento = async (req, res) => {
  try {
    const {
      id_colaborador,
      id_evento,
      Data_Part,
      Duracao_Part,
      Descricao_Part,
    } = req.body;

    if (
      !id_colaborador ||
      !id_evento ||
      !Data_Part ||
      !Duracao_Part ||
      !Descricao_Part
    ) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios." });
    }

    const [existing] = await db
      .promise()
      .query(
        "SELECT * FROM Certificado_Participacao WHERE ID_Colaborador = ? AND ID_Evento = ?",
        [id_colaborador, id_evento]
      );

    if (existing.length > 0) {
      return res.status(200).json({ mensagem: "Certificado já registrado." });
    }

    await db
      .promise()
      .query(
        "INSERT INTO Certificado_Participacao (ID_Colaborador, ID_Evento, Data_Part, Duracao_Part, Descricao_Part) VALUES (?, ?, ?, ?, ?)",
        [id_colaborador, id_evento, Data_Part, Duracao_Part, Descricao_Part]
      );

    res.status(201).json({ mensagem: "Certificado registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar certificado:", error);
    res.status(500).json({ mensagem: "Erro ao registrar certificado." });
  }
};
