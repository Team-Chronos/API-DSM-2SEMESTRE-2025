import db from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const criarCertPartEvento = async (req, res) => {
  const { id_colab, id_evento, data_part, duracao_part, descricao_part } = req.body;

  try {
    const [existing] = await db
      .promise()
      .query(
        "SELECT * FROM Certificado_Participacao WHERE ID_Colaborador = ? AND ID_Evento = ?",
        [id_colab, id_evento]
      );

    if (existing.length > 0) {
      return res.status(400).json({
        mensagem: "Participação já cadastrada para este colaborador neste evento.",
      });
    }

    const dataFinal = data_part || new Date();
    const duracaoFinal = duracao_part || "Carga horária não informada";
    const descricaoFinal = descricao_part || "Participação registrada com sucesso.";

    const query = `INSERT INTO Certificado_Participacao 
      (ID_Colaborador, ID_Evento, Data_Part, Duracao_Part, Descricao_Part)
      VALUES (?, ?, ?, ?, ?)`;
    await db
      .promise()
      .query(query, [id_colab, id_evento, dataFinal, duracaoFinal, descricaoFinal]);

    const [[colab]] = await db
      .promise()
      .query("SELECT Nome_Col FROM Colaboradores WHERE ID_Colaborador = ?", [id_colab]);

    const [[evento]] = await db
      .promise()
      .query(
        "SELECT Nome_Evento, Duracao_Evento, Data_Evento FROM Evento WHERE ID_Evento = ?",
        [id_evento]
      );

    const nomeColab = colab?.Nome_Col || `Colaborador ${id_colab}`;
    const nomeEvento = evento?.Nome_Evento || `Evento ${id_evento}`;
    const duracao = duracaoFinal || evento?.Duracao_Evento || "Carga horária variável";
    const dataEvento = new Date(evento?.Data_Evento || Date.now()).toLocaleDateString(
      "pt-BR"
    );
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const nomeArquivo = `certificado_${id_colab}_${nomeEvento}.pdf`;
    const caminhoCertificados = path.resolve("src/certificados", nomeArquivo);

    if (!fs.existsSync("src/certificados")) {
      fs.mkdirSync("src/certificados", { recursive: true });
    }

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });
    const stream = fs.createWriteStream(caminhoCertificados);
    doc.pipe(stream);

    doc.rect(30, 30, 782, 525).stroke("#555");

    doc
      .fontSize(32)
      .font("Times-Bold")
      .fillColor("#1a237e")
      .text("CERTIFICADO DE PARTICIPAÇÃO", 0, 80, { align: "center" })
      .moveDown(1.2);

    doc
      .fontSize(22)
      .fillColor("#000")
      .font("Times-Bold")
      .text(nomeEvento.toUpperCase(), { align: "center" })
      .moveDown(1.5);

    const texto = `Certificamos que ${nomeColab} participou e concluiu com êxito o evento "${nomeEvento}", realizado em ${dataEvento}, com carga horária total de ${duracao}.`;

    doc
      .fontSize(16)
      .font("Times-Roman")
      .fillColor("#000")
      .text(texto, 100, doc.y, {
        align: "justify",
        width: 640, 
        lineGap: 6,
      })
      .moveDown(2);

    doc
      .fontSize(14)
      .text(`São José dos Campos, ${dataAtual}.`, 0, doc.y + 40, {
        align: "right",
      })
      .moveDown(5);
    doc
      .moveDown(3)
      .fontSize(12)
      .text("_________________________________________", { align: "center" })
      .text("Coordenação de Eventos", { align: "center" })
      .moveDown(1)
      .fontSize(8)
      .fillColor("#555")
      .text("Sistema de Certificados - Projeto TCC 2025", { align: "center" });

    doc.end();


    stream.on("finish", () => {
      res.status(201).json({
        mensagem: "Participação cadastrada e certificado gerado com sucesso!",
        certificado: caminhoCertificados,
      });
    });
  } catch (err) {
    console.error("Erro ao cadastrar participação:", err);
    res.status(500).json({ mensagem: "Erro interno ao cadastrar participação." });
  }
};


export const listarCertPartEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT c.Nome_Col, cert.Data_Part, e.Duracao_Evento, cert.Descricao_Part,
             e.Nome_Evento, e.Descricao, e.Local_Evento
      FROM Certificado_Participacao cert
      LEFT JOIN Evento e ON e.id_evento = cert.id_evento
      LEFT JOIN Colaboradores c ON c.id_colaborador = cert.id_colaborador
      WHERE cert.ID_Colaborador = ?;
    `;

    const [certPEventos] = await db.promise().query(query, [id]);
    res.status(200).json(certPEventos);
  } catch (err) {
    console.error("Erro ao listar Participacao Evento:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
  }
};
export const obterCertPartEventoPorID = async (req, res) => {
  const { id_col, id_evento } = req.params;
  try {
    const query = `
      SELECT c.Nome_Col, cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part,
             e.Nome_Evento, e.Descricao, e.Local_Evento
      FROM Certificado_Participacao cert
      LEFT JOIN Evento e ON e.id_evento = cert.id_evento
      LEFT JOIN Colaboradores c ON c.id_colaborador = cert.id_colaborador
      WHERE cert.ID_Colaborador = ? AND cert.ID_Evento = ?;
    `;

    const [certPEventos] = await db.promise().query(query, [id_col, id_evento]);
    res.status(200).json(certPEventos[0]);
  } catch (err) {
    console.error("Erro ao listar Participacao Evento:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
  }
};