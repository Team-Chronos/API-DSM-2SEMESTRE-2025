import Relatorio from "../models/relatorio.js";
import db from "../config/db.js";
import excel from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportsDir = path.join(__dirname, "..", "..", "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function gerarDadosRelatorioEventos(dataInicio, dataFim) {
  let query = `
      SELECT 
        e.ID_Evento, e.Nome_Evento, e.Data_Evento, e.Duracao_Evento, e.Local_Evento, 
        COUNT(pe.ID_Colaborador) as total_participantes, 
        SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as confirmados, 
        SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as recusados 
      FROM Evento e 
      LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento`;
  const params = [];
  if (dataInicio && dataFim) {
    query += " WHERE e.Data_Evento BETWEEN ? AND ?";
    params.push(dataInicio, `${dataFim} 23:59:59`);
  }
  query += " GROUP BY e.ID_Evento ORDER BY e.Data_Evento DESC";
  const [eventos] = await db.promise().query(query, params);
  console.log(`[Dados Eventos] Encontrados ${eventos.length} eventos.`);
  return eventos;
}

async function gerarDadosRelatorioParticipacao(dataInicio, dataFim) {
  let query = `
      SELECT 
        c.Nome_Col, c.Email, s.Nome_Setor, 
        COUNT(pe.ID_Evento) as total_eventos, 
        SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as eventos_confirmados, 
        SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as eventos_recusados 
      FROM Colaboradores c 
      LEFT JOIN Participacao_Evento pe ON c.ID_colaborador = pe.ID_Colaborador 
      LEFT JOIN Evento e ON pe.ID_Evento = e.ID_Evento 
      LEFT JOIN Setor s ON c.Setor = s.ID_Setor`;
  const params = [];
  if (dataInicio && dataFim) {
    query += " WHERE e.Data_Evento BETWEEN ? AND ?";
    params.push(dataInicio, `${dataFim} 23:59:59`);
  } else {
  }
  query += " GROUP BY c.ID_colaborador ORDER BY c.Nome_Col";
  const [participacoes] = await db.promise().query(query, params);
  console.log(
    `[Dados Participação] Encontrados ${participacoes.length} registos.`
  );
  return participacoes;
}

async function gerarDadosRelatorioColaboradores() {
  const query = `
      SELECT 
        c.ID_colaborador, c.Nome_Col, c.Email, c.Telefone, 
        s.Nome_Setor, car.Nome_Cargo, 
        COUNT(pe.ID_Evento) as total_eventos_participados 
      FROM Colaboradores c 
      LEFT JOIN Setor s ON c.Setor = s.ID_Setor 
      LEFT JOIN Cargo car ON c.ID_Cargo = car.ID_Cargo 
      LEFT JOIN Participacao_Evento pe ON c.ID_colaborador = pe.ID_Colaborador 
      GROUP BY c.ID_colaborador 
      ORDER BY c.Nome_Col`;
  const [colaboradores] = await db.promise().query(query);
  console.log(
    `[Dados Colaboradores] Encontrados ${colaboradores.length} colaboradores.`
  );
  return colaboradores;
}

async function gerarDadosRelatorioAgregados() {
  const query = `SELECT *, TIMESTAMPDIFF(YEAR, nascimento, CURDATE()) as idade FROM Agregados ORDER BY nome`;
  const [agregados] = await db.promise().query(query);
  console.log(`[Dados Agregados] Encontrados ${agregados.length} agregados.`);
  return agregados;
}

async function gerarPDF(dados, titulo, dataInicio, dataFim) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, layout: "landscape" });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      doc.fontSize(18).text(titulo, { align: "center" }).moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
          align: "left",
        });
      if (
        dataInicio &&
        dataFim &&
        !titulo.includes("Colaboradores") &&
        !titulo.includes("Agregados")
      ) {
        doc.text(
          `Período: ${new Date(dataInicio).toLocaleDateString(
            "pt-BR"
          )} a ${new Date(dataFim).toLocaleDateString("pt-BR")}`,
          { align: "left" }
        );
      }
      doc.moveDown(1);

      if (titulo.includes("Eventos"))
        gerarTabelaPDF(
          doc,
          dados,
          [
            "ID",
            "Nome",
            "Data",
            "Local",
            "Participantes",
            "Confirmados",
            "Recusados",
          ],
          [
            "ID_Evento",
            "Nome_Evento",
            "Data_Evento",
            "Local_Evento",
            "total_participantes",
            "confirmados",
            "recusados",
          ]
        );
      else if (titulo.includes("Participação"))
        gerarTabelaPDF(
          doc,
          dados,
          [
            "Colaborador",
            "Email",
            "Setor",
            "Total Eventos",
            "Confirmados",
            "Recusados",
          ],
          [
            "Nome_Col",
            "Email",
            "Nome_Setor",
            "total_eventos",
            "eventos_confirmados",
            "eventos_recusados",
          ]
        );
      else if (titulo.includes("Colaboradores"))
        gerarTabelaPDF(
          doc,
          dados,
          ["ID", "Nome", "Email", "Telefone", "Cargo", "Setor", "Eventos"],
          [
            "ID_colaborador",
            "Nome_Col",
            "Email",
            "Telefone",
            "Nome_Cargo",
            "Nome_Setor",
            "total_eventos_participados",
          ]
        );
      else if (titulo.includes("Agregados"))
        gerarTabelaPDF(
          doc,
          dados,
          ["ID", "Nome", "CPF/CNPJ", "Telefone", "Email", "Idade", "Veículo"],
          [
            "id_agregado",
            "nome",
            (d) => d.cpf || d.cnpj || "N/A",
            "telefone",
            "email",
            "idade",
            (d) => `${d.marca || ""} ${d.modelo || ""}`.trim() || "N/A",
          ]
        );
      else doc.text("Tipo de relatório PDF não suportado para tabela.");

      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 35, {
            align: "right",
            width: doc.page.width - 100,
          });
      }

      doc.end();
    } catch (error) {
      console.error("Erro DENTRO da função gerarPDF:", error);
      reject(error);
    }
  });
}

function gerarTabelaPDF(doc, data, headers, keys) {
  const tableTop = doc.y;
  const rowHeight = 20;
  const headerHeight = 25;
  const colWidths = calcularLargurasColunas(doc, headers, data, keys);
  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
  const startX = (doc.page.width - tableWidth) / 2;

  doc.font("Helvetica-Bold").fillColor("black").fontSize(10);
  let currentX = startX;
  headers.forEach((header, i) => {
    doc.rect(currentX, tableTop, colWidths[i], headerHeight).stroke();
    doc.text(header, currentX + 5, tableTop + 8, {
      width: colWidths[i] - 10,
      align: "left",
    });
    currentX += colWidths[i];
  });

  doc.font("Helvetica").fontSize(9);
  let currentY = tableTop + headerHeight;
  data.forEach((item) => {
    if (currentY + rowHeight > doc.page.height - 50) {
      doc.addPage();
      currentY = 50;
      doc.font("Helvetica-Bold").fontSize(10);
      currentX = startX;
      headers.forEach((header, i) => {
        doc.rect(currentX, currentY, colWidths[i], headerHeight).stroke();
        doc.text(header, currentX + 5, currentY + 8, {
          width: colWidths[i] - 10,
          align: "left",
        });
        currentX += colWidths[i];
      });
      currentY += headerHeight;
      doc.font("Helvetica").fontSize(9);
    }

    currentX = startX;
    keys.forEach((key, i) => {
      let value;
      if (typeof key === "function") value = key(item) ?? "N/A";
      else if (typeof key === "string" && key.includes("Data"))
        value = item[key] ? new Date(item[key]).toLocaleString("pt-BR") : "N/A";
      else value = typeof key === "string" ? item[key] ?? "N/A" : "N/A";
      doc.rect(currentX, currentY, colWidths[i], rowHeight).stroke();
      doc
        .fillColor("black")
        .text(String(value), currentX + 5, currentY + 6, {
          width: colWidths[i] - 10,
          align: "left",
          ellipsis: true,
        });
      currentX += colWidths[i];
    });
    currentY += rowHeight;
  });
  doc.y = currentY;
}

function calcularLargurasColunas(doc, headers, data, keys) {
  const minWidth = 50;
  const maxWidth = 150;
  const padding = 10;
  const availableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  let widths = headers.map((header, i) => {
    const key = keys[i];
    const headerWidth =
      doc.widthOfString(header, { font: "Helvetica-Bold", fontSize: 10 }) +
      padding;
    const dataWidths = data.map((item) => {
      let value;
      if (typeof key === "function") value = key(item) ?? "";
      else if (typeof key === "string" && key.includes("Data"))
        value = item[key] ? new Date(item[key]).toLocaleString("pt-BR") : "";
      else value = typeof key === "string" ? item[key] ?? "" : "";
      return (
        doc.widthOfString(String(value), { font: "Helvetica", fontSize: 9 }) +
        padding
      );
    });
    const maxDataWidth = dataWidths.length > 0 ? Math.max(...dataWidths) : 0;
    return Math.max(headerWidth, maxDataWidth, minWidth);
  });

  const totalWidth = widths.reduce((sum, w) => sum + w, 0);
  if (totalWidth > availableWidth) {
    const factor = availableWidth / totalWidth;
    widths = widths.map((w) => Math.max(w * factor, minWidth * 0.8));
  }
  widths = widths.map((w) => Math.min(w, maxWidth));

  return widths;
}

export const listarRelatorios = async (req, res) => {
  try {
    const [relatorios] = await Relatorio.findAll();
    res.status(200).json(relatorios);
  } catch (err) {
    console.error("Erro ao listar relatórios:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar relatórios." });
  }
};

export const gerarRelatorioPDF = async (req, res) => {
  try {
    const { data_inicio, data_fim, tipo_relatorio } = req.body;
    const gerado_por = 1;

    console.log(`[Gerar PDF] Recebido pedido para tipo: ${tipo_relatorio}`);

    let relatorioData;
    let tituloRelatorio;

    switch (tipo_relatorio) {
      case "eventos":
        relatorioData = await gerarDadosRelatorioEventos(data_inicio, data_fim);
        tituloRelatorio = "Relatório de Eventos";
        break;
      case "participacao":
        relatorioData = await gerarDadosRelatorioParticipacao(
          data_inicio,
          data_fim
        );
        tituloRelatorio = "Relatório de Participação por Colaborador";
        break;
      case "colaboradores":
        relatorioData = await gerarDadosRelatorioColaboradores();
        tituloRelatorio = "Relatório de Colaboradores";
        break;
      case "agregados":
        relatorioData = await gerarDadosRelatorioAgregados();
        tituloRelatorio = "Relatório de Agregados";
        break;
      default:
        console.log(`[Gerar PDF] Tipo inválido: ${tipo_relatorio}`);
        return res
          .status(400)
          .json({ mensagem: "Tipo de relatório PDF inválido" });
    }

    if (!relatorioData || relatorioData.length === 0) {
      console.log("[Gerar PDF] Nenhum dado encontrado para os filtros.");
      return res
        .status(404)
        .json({
          mensagem: "Nenhum dado encontrado para os filtros selecionados.",
        });
    }

    const pdfBuffer = await gerarPDF(
      relatorioData,
      tituloRelatorio,
      data_inicio,
      data_fim
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const nomeArquivo = `relatorio-${tipo_relatorio}-${timestamp}.pdf`;
    const filePath = path.join(reportsDir, nomeArquivo);

    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`[Gerar PDF] Ficheiro salvo em: ${filePath}`);

    await Relatorio.create({
      nome: nomeArquivo,
      tipo: tipo_relatorio,
      geradoPor: gerado_por,
    });

    res.download(filePath, nomeArquivo, (err) => {
      if (err) console.error("[Gerar PDF] Erro ao enviar para download:", err);
      else console.log(`[Gerar PDF] Ficheiro ${nomeArquivo} enviado.`);
    });
  } catch (error) {
    console.error("[Gerar PDF] Erro:", error);
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro interno ao gerar PDF" });
    }
  }
};

export const gerarRelatorioExcel = async (req, res) => {
  try {
    const { data_inicio, data_fim, tipo_relatorio, cidade, segmento } =
      req.body;
    const gerado_por = 1;

    console.log(
      `[Gerar Excel] Recebido pedido para tipo: ${tipo_relatorio}, Cidade: ${cidade}, Segmento: ${segmento}`
    );

    let relatorioData;
    let tituloRelatorio;
    let headers = [];
    let tipoBusca = tipo_relatorio;
    if (tipo_relatorio === "participacao") tipoBusca = "interacoes";
    if (tipo_relatorio === "colaboradores") tipoBusca = "clientes";

    switch (tipoBusca) {
      case "clientes": {
        let query =
          "SELECT ID_Cliente, Nome_Cliente, Email_Cliente, Telefone_Cliente, Segmento, Cidade, Criado_Por, criado_em, Ultima_Interacao FROM Cliente";
        const whereClauses = [];
        const params = [];
        if (data_inicio && data_fim) {
          whereClauses.push("criado_em BETWEEN ? AND ?");
          params.push(data_inicio, `${data_fim} 23:59:59`);
        }
        if (cidade) {
          whereClauses.push("Cidade = ?");
          params.push(cidade);
        }
        if (segmento) {
          whereClauses.push("Segmento = ?");
          params.push(segmento);
        }
        if (whereClauses.length > 0)
          query += " WHERE " + whereClauses.join(" AND ");
        query += " ORDER BY Nome_Cliente";

        [relatorioData] = await db.promise().query(query, params);
        tituloRelatorio = "Relatório de Clientes";
        headers = [
          { header: "ID", key: "ID_Cliente", width: 10 },
          { header: "Nome", key: "Nome_Cliente", width: 35 },
          { header: "Email", key: "Email_Cliente", width: 35 },
          { header: "Telefone", key: "Telefone_Cliente", width: 20 },
          { header: "Segmento", key: "Segmento", width: 25 },
          { header: "Cidade", key: "Cidade", width: 25 },
          { header: "Data Cadastro", key: "criado_em", width: 20 },
          { header: "Última Interação", key: "Ultima_Interacao", width: 20 },
        ];
        relatorioData = relatorioData.map((c) => ({
          ...c,
          criado_em: c.criado_em
            ? new Date(c.criado_em).toLocaleDateString("pt-BR")
            : "",
          Ultima_Interacao: c.Ultima_Interacao
            ? new Date(c.Ultima_Interacao).toLocaleString("pt-BR")
            : "",
        }));
        break;
      }
      case "interacoes": {
        let query = `
                    SELECT 
                        hi.ID_Interacao, c.Nome_Cliente, c.Segmento, c.Cidade, 
                        col.Nome_Col AS Nome_Colaborador, hi.Data_Interacao, 
                        hi.Forma_Contato, hi.Titulo, 
                        hi.Descricao, hi.Resultado, hi.Status, 
                        hi.Proxima_Acao, hi.Data_Proxima_Acao 
                    FROM Historico_Interacao hi 
                    LEFT JOIN Cliente c ON hi.ID_Cliente = c.ID_Cliente 
                    LEFT JOIN Colaboradores col ON hi.ID_Colaborador = col.ID_colaborador`;
        const whereClauses = [];
        const params = [];
        if (data_inicio && data_fim) {
          whereClauses.push("hi.Data_Interacao BETWEEN ? AND ?");
          params.push(data_inicio, `${data_fim} 23:59:59`);
        }
        if (cidade) {
          whereClauses.push("c.Cidade = ?");
          params.push(cidade);
        }
        if (segmento) {
          whereClauses.push("c.Segmento = ?");
          params.push(segmento);
        }
        if (whereClauses.length > 0)
          query += " WHERE " + whereClauses.join(" AND ");
        query += " ORDER BY hi.Data_Interacao DESC";

        [relatorioData] = await db.promise().query(query, params);
        tituloRelatorio = "Relatório de Interações";
        headers = [
          { header: "ID", key: "ID_Interacao", width: 10 },
          { header: "Cliente", key: "Nome_Cliente", width: 30 },
          { header: "Cidade Cliente", key: "Cidade", width: 25 },
          { header: "Colaborador", key: "Nome_Colaborador", width: 30 },
          { header: "Data", key: "Data_Interacao", width: 20 },
          { header: "Forma Contato", key: "Forma_Contato", width: 15 },
          { header: "Título", key: "Titulo", width: 30 },
          { header: "Descrição", key: "Descricao", width: 50 },
          { header: "Resultado", key: "Resultado", width: 30 },
          { header: "Status", key: "Status", width: 15 },
          { header: "Próxima Ação", key: "Proxima_Acao", width: 30 },
          { header: "Data Próx. Ação", key: "Data_Proxima_Acao", width: 20 },
        ];
        relatorioData = relatorioData.map((i) => ({
          ...i,
          Data_Interacao: i.Data_Interacao
            ? new Date(i.Data_Interacao).toLocaleString("pt-BR")
            : "",
          Data_Proxima_Acao: i.Data_Proxima_Acao
            ? new Date(i.Data_Proxima_Acao).toLocaleString("pt-BR")
            : "",
        }));
        break;
      }
      case "agregados": {
        let query = `SELECT *, TIMESTAMPDIFF(YEAR, nascimento, CURDATE()) as idade FROM Agregados`;
        const whereClauses = [];
        const params = [];
        if (cidade) {
          whereClauses.push("cidadeNascimento LIKE ?");
          params.push(`%${cidade}%`);
        }
        if (whereClauses.length > 0)
          query += " WHERE " + whereClauses.join(" AND ");
        query += " ORDER BY nome";

        [relatorioData] = await db.promise().query(query, params);
        tituloRelatorio = "Relatório de Agregados";
        headers = [
          { header: "ID", key: "id_agregado", width: 10 },
          { header: "Nome", key: "nome", width: 30 },
          { header: "CPF/CNPJ", key: "documento", width: 20 },
          { header: "Telefone", key: "telefone", width: 20 },
          { header: "Email", key: "email", width: 30 },
          { header: "Cidade Nasc.", key: "cidadeNascimento", width: 25 },
          { header: "Idade", key: "idade", width: 10 },
          { header: "Veículo", key: "veiculo", width: 25 },
        ];
        relatorioData = relatorioData.map((a) => ({
          ...a,
          documento: a.cpf || a.cnpj || "N/A",
          veiculo: `${a.marca || ""} ${a.modelo || ""}`.trim() || "N/A",
          idade: a.idade ?? "N/A",
        }));
        break;
      }
      default:
        console.log("[Gerar Excel] Tipo inválido:", tipo_relatorio);
        return res
          .status(400)
          .json({ mensagem: "Tipo de relatório Excel inválido" });
    }

    if (!relatorioData || relatorioData.length === 0) {
      console.log("[Gerar Excel] Nenhum dado encontrado para filtros.");
      return res
        .status(404)
        .json({
          mensagem: "Nenhum dado encontrado para os filtros selecionados.",
        });
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(tituloRelatorio);
    worksheet.columns = headers;
    worksheet.addRows(relatorioData);
    worksheet.getRow(1).font = { bold: true };

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const nomeArquivo = `relatorio-${tipo_relatorio}-${timestamp}.xlsx`;
    const filePath = path.join(reportsDir, nomeArquivo);

    await workbook.xlsx.writeFile(filePath);
    console.log(`[Gerar Excel] Ficheiro salvo em: ${filePath}`);

    await Relatorio.create({
      nome: nomeArquivo,
      tipo: tipo_relatorio,
      geradoPor: gerado_por,
    });

    res.download(filePath, nomeArquivo, (err) => {
      if (err)
        console.error("[Gerar Excel] Erro ao enviar para download:", err);
      else console.log(`[Gerar Excel] Ficheiro ${nomeArquivo} enviado.`);
    });
  } catch (error) {
    console.error("[Gerar Excel] Erro:", error);
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro interno ao gerar Excel" });
    }
  }
};

export const obterTiposRelatorio = (req, res) => {
  const tipos = [
    { chave: "eventos", nome: "Eventos (PDF)" },
    { chave: "participacao", nome: "Participação Colaborador (PDF)" },
    { chave: "colaboradores", nome: "Lista Colaboradores (PDF)" },
    { chave: "agregados", nome: "Agregados (PDF/Excel)" },
    { chave: "clientes", nome: "Clientes (Excel)" },
    { chave: "interacoes", nome: "Interações Cliente (Excel)" },
  ];
  res.status(200).json(tipos);
};

export const obterRelatorioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [relatorios] = await Relatorio.findById(id);
    if (relatorios.length === 0)
      return res.status(404).json({ mensagem: "Relatório não encontrado" });
    res.status(200).json(relatorios[0]);
  } catch (error) {
    console.error("[Obter Por ID] Erro:", error);
    res.status(500).json({ mensagem: "Erro interno ao buscar relatório" });
  }
};

export const excluirRelatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const [relatorios] = await Relatorio.findById(id);
    if (relatorios.length === 0)
      return res.status(404).json({ mensagem: "Relatório não encontrado" });

    const filename = relatorios[0].Nome_Relatorio;
    const [result] = await Relatorio.deleteById(id);
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ mensagem: "Relatório não encontrado para exclusão" });

    const filePath = path.join(reportsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error(`[Excluir] Erro ao deletar ${filename}:`, unlinkErr);
        else console.log(`[Excluir] Ficheiro ${filename} excluído.`);
      });
    } else {
      console.warn(`[Excluir] Ficheiro ${filename} não encontrado.`);
    }
    res.status(200).json({ mensagem: "Relatório excluído com sucesso" });
  } catch (error) {
    console.error("[Excluir] Erro:", error);
    res.status(500).json({ mensagem: "Erro interno ao excluir relatório" });
  }
};
export const downloadRelatorio = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(reportsDir, filename);
  console.log(`[Download] Tentando descarregar: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error(`[Download] Erro ao enviar ${filename}:`, err);
        if (!res.headersSent)
          res.status(500).json({ mensagem: "Erro download." });
      } else {
        console.log(`[Download] ${filename} enviado.`);
      }
    });
  } else {
    console.log(`[Download] ${filename} não encontrado.`);
    res.status(404).json({ mensagem: "Arquivo não encontrado." });
  }
};
