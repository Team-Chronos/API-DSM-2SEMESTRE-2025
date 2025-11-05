import db from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
};

export const criarCertPartEvento = async (req, res) => {
  const {
    id_colab,
    id_evento,
    objetivo,
    principais_infos,
    aplicacoes_newe,
    referencias,
    avaliacao,
    comentarios
  } = req.body;

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
    const duracaoEvento = evento?.Duracao_Evento || "Carga horária não informada";
    const dataEvento = new Date(evento?.Data_Evento || Date.now()).toLocaleDateString(
      "pt-BR"
    );
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const dataFinalParticipacao = new Date();

    const descricaoFinal = `
Objetivo: ${objetivo}
Principais Informações: ${principais_infos}
Aplicações e Sugestões: ${aplicacoes_newe}
Referências: ${referencias || 'N/A'}
Avaliação: ${avaliacao}/10
Comentários: ${comentarios || 'N/A'}
    `.trim();

    const nomeColabSanitized = slugify(nomeColab);
    const nomeEventoSanitized = slugify(nomeEvento);

    const nomeArquivoCertificado = `certificado_${nomeColabSanitized}_${nomeEventoSanitized}.pdf`;
    const nomeArquivoRelatorio = `relatorio_${nomeColabSanitized}_${nomeEventoSanitized}.pdf`;

    const caminhoCertificado = path.resolve("src/certificados", nomeArquivoCertificado);
    const caminhoRelatorio = path.resolve("src/relatorios_part", nomeArquivoRelatorio);

    const query = `INSERT INTO Certificado_Participacao (ID_Colaborador, ID_Evento, Data_Part, Duracao_Part, Descricao_Part, Arquivo_PDF) VALUES (?, ?, ?, ?, ?, ?)`;
    await db
      .promise()
      .query(query, [id_colab, id_evento, dataFinalParticipacao, duracaoEvento, descricaoFinal, nomeArquivoCertificado]);

    if (!fs.existsSync("src/certificados")) {
      fs.mkdirSync("src/certificados", { recursive: true });
    }
    if (!fs.existsSync("src/relatorios_part")) {
      fs.mkdirSync("src/relatorios_part", { recursive: true });
    }

    const docCert = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });
    const streamCert = fs.createWriteStream(caminhoCertificado);
    docCert.pipe(streamCert);

    docCert.rect(30, 30, 782, 525).stroke("#555");
    docCert
      .fontSize(32)
      .font("Times-Bold")
      .fillColor("#1a237e")
      .text("CERTIFICADO DE PARTICIPAÇÃO", 0, 80, { align: "center" })
      .moveDown(1.2);
    docCert
      .fontSize(22)
      .fillColor("#000")
      .font("Times-Bold")
      .text(nomeEvento.toUpperCase(), { align: "center" })
      .moveDown(1.5);
    const texto = `Certificamos que ${nomeColab} participou e concluiu com êxito o evento "${nomeEvento}", realizado em ${dataEvento}, com carga horária total de ${duracaoEvento}.`;
    docCert
      .fontSize(16)
      .font("Times-Roman")
      .fillColor("#000")
      .text(texto, 100, docCert.y, {
        align: "justify",
        width: 640,
        lineGap: 6,
      })
      .moveDown(2);
    docCert
      .fontSize(14)
      .text(`São José dos Campos, ${dataAtual}.`, 0, docCert.y + 40, {
        align: "right",
      })
      .moveDown(5);
    docCert
      .moveDown(3)
      .fontSize(12)
      .text("_________________________________________", { align: "center" })
      .text("Coordenação de Eventos", { align: "center" })
      .moveDown(1)
      .fontSize(8)
      .fillColor("#555")
      .text("Sistema de Certificados - Projeto TCC 2025", { align: "center" });
    docCert.end();

    const docRel = new PDFDocument({ size: "A4", layout: "portrait", margin: 50 });
    const streamRel = fs.createWriteStream(caminhoRelatorio);
    docRel.pipe(streamRel);

    docRel
      .fontSize(20)
      .font("Times-Bold")
      .fillColor("#1a237e")
      .text("Relatório de Participação", { align: "center" })
      .moveDown(1.5);

    docRel.fontSize(12).font("Times-Roman").fillColor("#000");
    docRel.text(`Participante: `, { continued: true }).font("Times-Bold").text(nomeColab);
    docRel.text(`Evento: `, { continued: true }).font("Times-Bold").text(nomeEvento);
    docRel.text(`Data: `, { continued: true }).font("Times-Bold").text(dataEvento);
    docRel.text(`Avaliação: `, { continued: true }).font("Times-Bold").text(`${avaliacao}/10`);
    docRel.moveDown(2);

    const addSection = (title, content) => {
      if (content) {
        docRel.fontSize(14).font("Times-Bold").text(title, { underline: true });
        docRel.moveDown(0.5);
        docRel.fontSize(12).font("Times-Roman").text(content, { align: "justify" });
        docRel.moveDown(1);
      }
    };

    addSection("Objetivo da Participação", objetivo);
    addSection("Principais Informações Obtidas", principais_infos);
    addSection("Aplicações e Sugestões", aplicacoes_newe);
    addSection("Referências", referencias);
    addSection("Comentários Adicionais", comentarios);
    docRel.end();

    streamCert.on("finish", () => {
      res.status(201).json({
        mensagem: "Participação cadastrada e certificado/relatório gerados com sucesso!",
        certificado: caminhoCertificado,
        relatorio: caminhoRelatorio
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
    const query = `SELECT c.Nome_Col, cert.Data_Part, e.Duracao_Evento, cert.Descricao_Part, e.Nome_Evento, e.Descricao, e.Local_Evento FROM Certificado_Participacao cert LEFT JOIN Evento e ON e.id_evento = cert.id_evento LEFT JOIN Colaboradores c ON c.id_colaborador = cert.id_colaborador WHERE cert.ID_Colaborador = ?;`;
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
    const query = `SELECT c.Nome_Col, cert.Data_Part, cert.Duracao_Part, cert.Descricao_Part, e.Nome_Evento, e.Descricao, e.Local_Evento FROM Certificado_Participacao cert LEFT JOIN Evento e ON e.id_evento = cert.id_evento LEFT JOIN Colaboradores c ON c.id_colaborador = cert.id_colaborador WHERE cert.ID_Colaborador = ? AND cert.ID_Evento = ?;`;
    const [certPEventos] = await db.promise().query(query, [id_col, id_evento]);
    res.status(200).json(certPEventos[0]);
  } catch (err) {
    console.error("Erro ao listar Participacao Evento:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar Participacao Evento." });
  }
};

export const listarCertificadosDoUsuario = async (req, res) => {
  const { id_colab } = req.params;
  try {
    const query = `SELECT cert.ID_Colaborador, cert.ID_Evento, cert.Arquivo_PDF, e.Nome_Evento, e.Data_Evento FROM Certificado_Participacao cert LEFT JOIN Evento e ON e.id_evento = cert.id_evento WHERE cert.ID_Colaborador = ? AND cert.Arquivo_PDF IS NOT NULL;`;
    const [certificados] = await db.promise().query(query, [id_colab]);
    res.status(200).json(certificados);
  } catch (err) {
    console.error("Erro ao listar certificados do usuário:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar certificados." });
  }
};

export const baixarCertificado = async (req, res) => {
  const { nomeArquivo } = req.params;
  if (nomeArquivo.includes("..") || nomeArquivo.includes("/") || nomeArquivo.includes("\\")) {
    return res.status(400).json({ mensagem: "Nome de arquivo inválido." });
  }
  try {
    const caminhoArquivo = path.resolve("src/certificados", nomeArquivo);
    if (fs.existsSync(caminhoArquivo)) {
      res.download(caminhoArquivo);
    } else {
      res.status(404).json({ mensagem: "Certificado não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao baixar certificado:", err);
    res.status(500).json({ mensagem: "Erro interno ao baixar certificado." });
  }
};