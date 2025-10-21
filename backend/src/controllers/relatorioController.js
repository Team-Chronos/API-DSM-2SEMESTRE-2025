import Relatorio from '../models/relatorio.js';
import db from '../config/db.js';
import excel from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function listarRelatorios(req, res) {
  try {
    const query = `
      SELECT 
        r.ID_Relatorio,
        r.Nome_Relatorio,
        r.Tipo_Relatorio,
        r.Data_Geracao,
        c.Nome_Col AS Gerado_Por
      FROM Relatorio r
      LEFT JOIN Colaboradores c ON r.Gerado_Por = c.ID_colaborador
      ORDER BY r.Data_Geracao DESC
    `;
    const [relatorios] = await db.promise().query(query);
    res.status(200).json(relatorios);
  } catch (err) {
    console.error("Erro ao listar relatórios:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar relatórios." });
  }
}

export async function gerarRelatorio(req, res) {
  const { tipo } = req.body;

  const geradoPorId = 1;

  if (!tipo || !['clientes', 'vendas', 'interacoes'].includes(tipo)) {
    return res.status(400).json({ mensagem: "Um tipo de relatório válido deve ser fornecido." });
  }

  try {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(`Relatório de ${tipo}`);
    let data = [];
    let headers = [];
    let filename = '';

    switch (tipo) {
      case 'clientes':
        const [clientes] = await db.promise().query("SELECT ID_Cliente, Nome_Cliente, Email_Cliente, Telefone_Cliente, segmento_atuacao, atividade, Etapa, Data_Cadastro FROM Cliente ORDER BY Nome_Cliente");
        headers = [
          { header: 'ID', key: 'ID_Cliente', width: 10 },
          { header: 'Nome', key: 'Nome_Cliente', width: 35 },
          { header: 'Email', key: 'Email_Cliente', width: 35 },
          { header: 'Telefone', key: 'Telefone_Cliente', width: 20 },
          { header: 'Segmento', key: 'segmento_atuacao', width: 25 },
          { header: 'Atividade', key: 'atividade', width: 30 },
          { header: 'Etapa', key: 'Etapa', width: 15 },
          { header: 'Data de Cadastro', key: 'Data_Cadastro', width: 20 },
        ];
        data = clientes.map(c => ({
          ...c,
          Data_Cadastro: c.Data_Cadastro ? new Date(c.Data_Cadastro).toLocaleDateString('pt-BR') : ''
        }));
        break;

      case 'vendas':
        const [vendas] = await db.promise().query("SELECT ID_Cliente, Nome_Cliente, Email_Cliente, Telefone_Cliente, segmento_atuacao, depart_responsavel, Data_Cadastro FROM Cliente WHERE Etapa = 'Finalizada' ORDER BY Nome_Cliente");
        headers = [
          { header: 'ID Cliente', key: 'ID_Cliente', width: 10 },
          { header: 'Nome do Cliente', key: 'Nome_Cliente', width: 35 },
          { header: 'Email', key: 'Email_Cliente', width: 35 },
          { header: 'Telefone', key: 'Telefone_Cliente', width: 20 },
          { header: 'Segmento', key: 'segmento_atuacao', width: 25 },
          { header: 'Departamento Responsável', key: 'depart_responsavel', width: 30 },
          { header: 'Data do Cadastro', key: 'Data_Cadastro', width: 20 },
        ];
        data = vendas.map(v => ({
            ...v,
            Data_Cadastro: v.Data_Cadastro ? new Date(v.Data_Cadastro).toLocaleDateString('pt-BR') : ''
        }));
        break;
      
      case 'interacoes':
        const query = `
            SELECT 
                hi.ID_Interacao,
                c.Nome_Cliente,
                col.Nome_Col AS Nome_Colaborador,
                hi.Data_Interacao,
                hi.Tipo_Interacao,
                hi.Descricao,
                hi.Resultado
            FROM Historico_Interacao hi
            LEFT JOIN Cliente c ON hi.ID_Cliente = c.ID_Cliente
            LEFT JOIN Colaboradores col ON hi.ID_Colaborador = col.ID_colaborador
            ORDER BY hi.Data_Interacao DESC
        `;
        const [interacoes] = await db.promise().query(query);
        headers = [
            { header: 'ID', key: 'ID_Interacao', width: 10 },
            { header: 'Cliente', key: 'Nome_Cliente', width: 30 },
            { header: 'Colaborador', key: 'Nome_Colaborador', width: 30 },
            { header: 'Data', key: 'Data_Interacao', width: 20 },
            { header: 'Tipo', key: 'Tipo_Interacao', width: 15 },
            { header: 'Descrição', key: 'Descricao', width: 50 },
            { header: 'Resultado', key: 'Resultado', width: 30 },
        ];
        data = interacoes.map(i => ({
            ...i,
            Data_Interacao: i.Data_Interacao ? new Date(i.Data_Interacao).toLocaleString('pt-BR') : ''
        }));
        break;

      default:
        return res.status(400).json({ mensagem: "Este tipo de relatório ainda não é suportado." });
    }

    worksheet.columns = headers;
    worksheet.addRows(data);
    worksheet.getRow(1).font = { bold: true };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    filename = `relatorio-${tipo}-${timestamp}.xlsx`;
    
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path.join(tempDir, filename);

    await workbook.xlsx.writeFile(filePath);

    await Relatorio.create({
      nome: filename,
      tipo: tipo,
      geradoPor: geradoPorId,
    });

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Erro ao enviar o arquivo de relatório para download:", err);
      }
      
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao deletar o arquivo de relatório temporário:", unlinkErr);
        }
      });
    });

  } catch (err) {
    console.error(`Erro ao gerar relatório de ${tipo}:`, err);
    res.status(500).json({ mensagem: `Erro interno ao gerar o relatório de ${tipo}.` });
  }
}

