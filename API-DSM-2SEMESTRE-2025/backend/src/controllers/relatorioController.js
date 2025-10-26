import db from '../config/db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gerarRelatorioEventos = async (req, res) => {
    try {
        const { data_inicio, data_fim, tipo_relatorio } = req.body;
        const gerado_por = req.user?.id || 1;

        let relatorioData;
        let tituloRelatorio;

        switch (tipo_relatorio) {
            case 'eventos':
                relatorioData = await gerarDadosRelatorioEventos(data_inicio, data_fim);
                tituloRelatorio = 'Relatório de Eventos';
                break;
            case 'participacao':
                relatorioData = await gerarDadosRelatorioParticipacao(data_inicio, data_fim);
                tituloRelatorio = 'Relatório de Participação';
                break;
            case 'colaboradores':
                relatorioData = await gerarDadosRelatorioColaboradores();
                tituloRelatorio = 'Relatório de Colaboradores';
                break;
            case 'agregados':
                relatorioData = await gerarDadosRelatorioAgregados();
                tituloRelatorio = 'Relatório de Agregados';
                break;
            default:
                return res.status(400).json({ mensagem: 'Tipo de relatório inválido' });
        }

        const pdfBuffer = await gerarPDF(relatorioData, tituloRelatorio, data_inicio, data_fim);

        const nomeArquivo = `${tipo_relatorio}_${Date.now()}.pdf`;
        const caminhoArquivo = `/relatorios/${nomeArquivo}`;

        await salvarRelatorioNoBanco({
            nome_relatorio: tituloRelatorio,
            tipo_relatorio: tipo_relatorio,
            url_relatorio: caminhoArquivo,
            gerado_por: gerado_por
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
        
        res.send(pdfBuffer);

    } catch (error) {
        console.error(' Erro ao gerar relatório:', error);
        res.status(500).json({ mensagem: 'Erro interno ao gerar relatório' });
    }
};

export const listarRelatorios = async (req, res) => {
    try {
        const query = `
            SELECT r.*, c.Nome_Col as gerador_nome 
            FROM Relatorio r
            LEFT JOIN Colaboradores c ON r.Gerado_Por = c.ID_colaborador
            ORDER BY r.Data_Geracao DESC
        `;

        const [relatorios] = await db.promise().query(query);
        res.status(200).json(relatorios);

    } catch (error) {
        console.error(' Erro ao listar relatórios:', error);
        res.status(500).json({ mensagem: 'Erro interno ao listar relatórios' });
    }
};

async function gerarDadosRelatorioEventos(dataInicio, dataFim) {
    let query = `
        SELECT 
            e.*,
            COUNT(pe.ID_Colaborador) as total_participantes,
            SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as confirmados,
            SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as recusados
        FROM Evento e
        LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento
    `;

    const params = [];

    if (dataInicio && dataFim) {
        query += ' WHERE e.Data_Evento BETWEEN ? AND ?';
        params.push(dataInicio, dataFim);
    }

    query += ' GROUP BY e.ID_Evento ORDER BY e.Data_Evento DESC';

    const [eventos] = await db.promise().query(query, params);
    return eventos;
}

async function gerarDadosRelatorioParticipacao(dataInicio, dataFim) {
    let query = `
        SELECT 
            c.Nome_Col,
            c.Email,
            c.Setor,
            COUNT(pe.ID_Evento) as total_eventos,
            SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as eventos_confirmados,
            SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as eventos_recusados,
            s.Nome_Setor
        FROM Colaboradores c
        LEFT JOIN Participacao_Evento pe ON c.ID_colaborador = pe.ID_Colaborador
        LEFT JOIN Evento e ON pe.ID_Evento = e.ID_Evento
        LEFT JOIN Setor s ON c.Setor = s.ID_Setor
    `;

    const params = [];

    if (dataInicio && dataFim) {
        query += ' WHERE e.Data_Evento BETWEEN ? AND ? OR e.Data_Evento IS NULL';
        params.push(dataInicio, dataFim);
    }

    query += ' GROUP BY c.ID_colaborador ORDER BY c.Nome_Col';

    const [participacoes] = await db.promise().query(query, params);
    return participacoes;
}

async function gerarDadosRelatorioColaboradores() {
    const query = `
        SELECT 
            c.*,
            s.Nome_Setor,
            car.Nome_Cargo,
            COUNT(pe.ID_Evento) as total_eventos_participados
        FROM Colaboradores c
        LEFT JOIN Setor s ON c.Setor = s.ID_Setor
        LEFT JOIN Cargo car ON c.ID_Cargo = car.ID_Cargo
        LEFT JOIN Participacao_Evento pe ON c.ID_colaborador = pe.ID_Colaborador
        GROUP BY c.ID_colaborador
        ORDER BY c.Nome_Col
    `;

    const [colaboradores] = await db.promise().query(query);
    return colaboradores;
}

async function gerarDadosRelatorioAgregados() {
    const query = `
        SELECT 
            *,
            TIMESTAMPDIFF(YEAR, nascimento, CURDATE()) as idade
        FROM Agregados 
        ORDER BY nome
    `;

    const [agregados] = await db.promise().query(query);
    return agregados;
}

async function gerarPDF(dados, titulo, dataInicio, dataFim) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            doc.fillColor('#333333')
               .fontSize(20)
               .text(titulo, 50, 50, { align: 'center' });

            doc.fontSize(10)
               .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 50, 80);

            if (dataInicio && dataFim) {
                doc.text(`Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} à ${new Date(dataFim).toLocaleDateString('pt-BR')}`, 50, 95);
            }

            doc.moveDown(2);

            if (titulo.includes('Eventos')) {
                gerarPDFEventos(doc, dados);
            } else if (titulo.includes('Participação')) {
                gerarPDFParticipacao(doc, dados);
            } else if (titulo.includes('Colaboradores')) {
                gerarPDFColaboradores(doc, dados);
            } else if (titulo.includes('Agregados')) {
                gerarPDFAgregados(doc, dados);
            }

            const pageHeight = doc.page.height;
            doc.fontSize(8)
               .text('Sistema Newe Log - Relatório Gerado Automaticamente', 50, pageHeight - 50, { align: 'center' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

function gerarPDFEventos(doc, eventos) {
    let yPosition = 120;

    eventos.forEach((evento, index) => {
        if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
        }

        doc.fontSize(12)
           .fillColor('#2c5530')
           .text(`${index + 1}. ${evento.Nome_Evento}`, 50, yPosition);

        doc.fontSize(9)
           .fillColor('#666666')
           .text(`Data: ${new Date(evento.Data_Evento).toLocaleString('pt-BR')}`, 70, yPosition + 15)
           .text(`Local: ${evento.Local_Evento}`, 70, yPosition + 30)
           .text(`Participantes: ${evento.total_participantes} (${evento.confirmados} confirmados, ${evento.recusados} recusados)`, 70, yPosition + 45);

        yPosition += 70;
    });

    if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
    }

    doc.fontSize(11)
       .fillColor('#333333')
       .text('RESUMO:', 50, yPosition + 20)
       .text(`Total de Eventos: ${eventos.length}`, 70, yPosition + 35)
       .text(`Total de Participantes: ${eventos.reduce((sum, e) => sum + parseInt(e.total_participantes), 0)}`, 70, yPosition + 50);
}

function gerarPDFParticipacao(doc, participacoes) {
    let yPosition = 120;

    participacoes.forEach((part, index) => {
        if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
        }

        doc.fontSize(11)
           .fillColor('#2c5530')
           .text(`${index + 1}. ${part.Nome_Col}`, 50, yPosition);

        doc.fontSize(9)
           .fillColor('#666666')
           .text(`Setor: ${part.Nome_Setor || 'N/A'}`, 70, yPosition + 15)
           .text(`Email: ${part.Email}`, 70, yPosition + 30)
           .text(`Eventos: ${part.total_eventos} (${part.eventos_confirmados} confirmados, ${part.eventos_recusados} recusados)`, 70, yPosition + 45);

        yPosition += 70;
    });
}

function gerarPDFColaboradores(doc, colaboradores) {
    let yPosition = 120;

    colaboradores.forEach((colab, index) => {
        if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
        }

        doc.fontSize(11)
           .fillColor('#2c5530')
           .text(`${index + 1}. ${colab.Nome_Col}`, 50, yPosition);

        doc.fontSize(9)
           .fillColor('#666666')
           .text(`Cargo: ${colab.Nome_Cargo}`, 70, yPosition + 15)
           .text(`Setor: ${colab.Nome_Setor}`, 70, yPosition + 30)
           .text(`Email: ${colab.Email}`, 70, yPosition + 45)
           .text(`Eventos Participados: ${colab.total_eventos_participados}`, 70, yPosition + 60);

        yPosition += 85;
    });
}

function gerarPDFAgregados(doc, agregados) {
    let yPosition = 120;

    agregados.forEach((agregado, index) => {
        if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
        }

        doc.fontSize(11)
           .fillColor('#2c5530')
           .text(`${index + 1}. ${agregado.nome}`, 50, yPosition);

        doc.fontSize(9)
           .fillColor('#666666')
           .text(`CPF: ${agregado.cpf || 'N/A'}`, 70, yPosition + 15)
           .text(`Email: ${agregado.email || 'N/A'}`, 70, yPosition + 30)
           .text(`Telefone: ${agregado.telefone || 'N/A'}`, 70, yPosition + 45)
           .text(`Veículo: ${agregado.marca || 'N/A'} ${agregado.modelo || ''}`, 70, yPosition + 60);

        yPosition += 85;
    });
}

async function salvarRelatorioNoBanco(dadosRelatorio) {
    const query = `
        INSERT INTO Relatorio (Nome_Relatorio, Tipo_Relatorio, URL_Relatorio, Gerado_Por)
        VALUES (?, ?, ?, ?)
    `;

    await db.promise().query(query, [
        dadosRelatorio.nome_relatorio,
        dadosRelatorio.tipo_relatorio,
        dadosRelatorio.url_relatorio,
        dadosRelatorio.gerado_por
    ]);
}

export const obterRelatorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT r.*, c.Nome_Col as gerador_nome 
            FROM Relatorio r
            LEFT JOIN Colaboradores c ON r.Gerado_Por = c.ID_colaborador
            WHERE r.ID_Relatorio = ?
        `;

        const [relatorios] = await db.promise().query(query, [id]);

        if (relatorios.length === 0) {
            return res.status(404).json({ mensagem: 'Relatório não encontrado' });
        }

        res.status(200).json(relatorios[0]);

    } catch (error) {
        console.error(' Erro ao buscar relatório:', error);
        res.status(500).json({ mensagem: 'Erro interno ao buscar relatório' });
    }
};

export const excluirRelatorio = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM Relatorio WHERE ID_Relatorio = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Relatório não encontrado' });
        }

        res.status(200).json({ mensagem: 'Relatório excluído com sucesso' });

    } catch (error) {
        console.error(' Erro ao excluir relatório:', error);
        res.status(500).json({ mensagem: 'Erro interno ao excluir relatório' });
    }
};