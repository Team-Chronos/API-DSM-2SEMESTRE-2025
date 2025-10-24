import Relatorio from '../models/relatorio.js';
import db from '../config/db.js';
import excel from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportsDir = path.join(__dirname, '..', '..', 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export async function listarRelatorios(req, res) {
  try {
    const [relatorios] = await Relatorio.findAll(); 
    res.status(200).json(relatorios);
  } catch (err) {
    console.error("Erro ao listar relatórios:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar relatórios." });
  }
}

export async function gerarRelatorio(req, res) {
  const { tipo, dataInicio, dataFim, cidade, segmento } = req.body;
  
  const geradoPorId = 1; 

  if (!tipo || !['clientes', 'vendas', 'interacoes'].includes(tipo)) {
    return res.status(400).json({ mensagem: "Um tipo de relatório válido deve ser fornecido." });
  }

  try {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(`Relatório de ${tipo}`);
    let data = [];
    let headers = [];

    switch (tipo) {
      case 'clientes': {
        let query = "SELECT ID_Cliente, Nome_Cliente, Email_Cliente, Telefone_Cliente, segmento_atuacao, atividade, Etapa, Data_Cadastro, Endereco FROM Cliente";
        const whereClauses = [];
        const params = [];
        if (dataInicio && dataFim) { whereClauses.push("Data_Cadastro BETWEEN ? AND ?"); params.push(dataInicio, `${dataFim} 23:59:59`); }
        if (cidade) { whereClauses.push("Endereco LIKE ?"); params.push(`%${cidade}%`); } 
        if (segmento) { whereClauses.push("segmento_atuacao = ?"); params.push(segmento); }
        if (whereClauses.length > 0) { query += " WHERE " + whereClauses.join(" AND "); }
        query += " ORDER BY Nome_Cliente";
        
        const [clientes] = await db.promise().query(query, params);
        if (clientes.length === 0) {
             return res.status(404).json({ mensagem: "Nenhum dado encontrado para os filtros selecionados. O relatório não foi gerado." });
        }
        
        headers = [
          { header: 'ID', key: 'ID_Cliente', width: 10 }, { header: 'Nome', key: 'Nome_Cliente', width: 35 },
          { header: 'Email', key: 'Email_Cliente', width: 35 }, { header: 'Telefone', key: 'Telefone_Cliente', width: 20 },
          { header: 'Segmento', key: 'segmento_atuacao', width: 25 }, { header: 'Atividade', key: 'atividade', width: 30 },
          { header: 'Endereço', key: 'Endereco', width: 50 }, { header: 'Etapa', key: 'Etapa', width: 15 },
          { header: 'Data Cadastro', key: 'Data_Cadastro', width: 20 },
        ];
        data = clientes.map(c => ({ ...c, Data_Cadastro: c.Data_Cadastro ? new Date(c.Data_Cadastro).toLocaleDateString('pt-BR') : '' }));
        break;
      }
      case 'vendas': {
        let query = "SELECT ID_Cliente, Nome_Cliente, Email_Cliente, Telefone_Cliente, segmento_atuacao, depart_responsavel, Data_Cadastro, Endereco FROM Cliente";
        const whereClauses = ["Etapa = 'Finalizada'"]; 
        const params = [];
        if (dataInicio && dataFim) { whereClauses.push("Data_Cadastro BETWEEN ? AND ?"); params.push(dataInicio, `${dataFim} 23:59:59`); }
        if (cidade) { whereClauses.push("Endereco LIKE ?"); params.push(`%${cidade}%`); }
        if (segmento) { whereClauses.push("segmento_atuacao = ?"); params.push(segmento); }
        query += " WHERE " + whereClauses.join(" AND ");
        query += " ORDER BY Nome_Cliente";

        const [vendas] = await db.promise().query(query, params);
        if (vendas.length === 0) return res.status(404).json({ mensagem: "Nenhum dado encontrado para os filtros selecionados." });

        headers = [
          { header: 'ID Cliente', key: 'ID_Cliente', width: 10 }, { header: 'Nome Cliente', key: 'Nome_Cliente', width: 35 },
          { header: 'Email', key: 'Email_Cliente', width: 35 }, { header: 'Telefone', key: 'Telefone_Cliente', width: 20 },
          { header: 'Endereço', key: 'Endereco', width: 50 }, { header: 'Segmento', key: 'segmento_atuacao', width: 25 },
          { header: 'Departamento', key: 'depart_responsavel', width: 30 }, { header: 'Data Cadastro', key: 'Data_Cadastro', width: 20 },
        ];
        data = vendas.map(v => ({ ...v, Data_Cadastro: v.Data_Cadastro ? new Date(v.Data_Cadastro).toLocaleDateString('pt-BR') : '' }));
        break;
      }
      case 'interacoes': {
        let query = `SELECT hi.ID_Interacao, c.Nome_Cliente, c.Endereco, c.segmento_atuacao, col.Nome_Col AS Nome_Colaborador, hi.Data_Interacao, hi.Tipo_Interacao, hi.Descricao, hi.Resultado FROM Historico_Interacao hi LEFT JOIN Cliente c ON hi.ID_Cliente = c.ID_Cliente LEFT JOIN Colaboradores col ON hi.ID_Colaborador = col.ID_colaborador`;
        const whereClauses = [];
        const params = [];
        if (dataInicio && dataFim) { whereClauses.push("hi.Data_Interacao BETWEEN ? AND ?"); params.push(dataInicio, `${dataFim} 23:59:59`); }
        if (cidade) { whereClauses.push("c.Endereco LIKE ?"); params.push(`%${cidade}%`); } 
        if (segmento) { whereClauses.push("c.segmento_atuacao = ?"); params.push(segmento); } 
        if (whereClauses.length > 0) { query += " WHERE " + whereClauses.join(" AND "); }
        query += " ORDER BY hi.Data_Interacao DESC";
        
        const [interacoes] = await db.promise().query(query, params);
        if (interacoes.length === 0) return res.status(404).json({ mensagem: "Nenhum dado encontrado para os filtros selecionados." });

        headers = [
            { header: 'ID', key: 'ID_Interacao', width: 10 }, { header: 'Cliente', key: 'Nome_Cliente', width: 30 },
            { header: 'Colaborador', key: 'Nome_Colaborador', width: 30 }, { header: 'Data', key: 'Data_Interacao', width: 20 },
            { header: 'Tipo', key: 'Tipo_Interacao', width: 15 }, { header: 'Descrição', key: 'Descricao', width: 50 },
            { header: 'Resultado', key: 'Resultado', width: 30 },
        ];
        data = interacoes.map(i => ({ ...i, Data_Interacao: i.Data_Interacao ? new Date(i.Data_Interacao).toLocaleString('pt-BR') : '' }));
        break;
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `relatorio-${tipo}-${timestamp}.xlsx`;
    const filePath = path.join(reportsDir, filename); 

    worksheet.columns = headers;
    worksheet.addRows(data);
    worksheet.getRow(1).font = { bold: true };
    await workbook.xlsx.writeFile(filePath);

    await Relatorio.create({
      nome: filename,
      tipo: tipo,
      geradoPor: geradoPorId,
    });

    res.download(filePath, filename);

  } catch (err) {
    console.error(`Erro ao gerar relatório de ${tipo}:`, err);
    res.status(500).json({ mensagem: `Erro interno ao gerar o relatório de ${tipo}.` });
  }
}

export async function downloadRelatorio(req, res) {
  const { filename } = req.params;
  const filePath = path.join(reportsDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename);
  } else {
    res.status(404).json({ mensagem: "Arquivo de relatório não encontrado no servidor." }); 
  }
}

export async function excluirRelatorio(req, res) {
  const { id } = req.params;

  try {
    const [relatorioResult] = await Relatorio.findById(id);
    if (relatorioResult.length === 0) {
      return res.status(404).json({ mensagem: "Registo de relatório não encontrado." });
    }
    const filename = relatorioResult[0].Nome_Relatorio;

    await Relatorio.deleteById(id);

    const filePath = path.join(reportsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao deletar o arquivo de relatório físico:", unlinkErr);
        }
      });
    } else {
        console.warn(`Ficheiro ${filename} não encontrado para exclusão física, mas o registo foi removido da base de dados.`);
    }

    res.status(200).json({ mensagem: "Relatório excluído com sucesso." });

  } catch (err) {
    console.error(`Erro ao excluir o relatório ${id}:`, err);
    res.status(500).json({ mensagem: `Erro interno ao excluir o relatório.` });
  }
}

