import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { listarCertificados } from "./src/controllers/certificadoController.js";

import eventoRoutes from './src/routes/eventoRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import agregadoRoutes from './src/routes/agregadoRoutes.js';
import interacaoRoutes from './src/routes/interacaoRoutes.js';
import participacaoEventoRoutes from './src/routes/participacaoEventoRoutes.js';
import certificadoPartRoutes from './src/routes/certificadoPartRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js';
import relatorioRoutes from './src/routes/relatorioRoutes.js';
import checklistRoutes from './src/routes/checklistRoutes.js';
import checklistVeiculoAgregadoRoutes from './src/routes/checklistVeiculoAgregadoRoutes.js';
import checklistPredialRoutes from './src/routes/checklistPredialRoutes.js';
import modalidadeRoutes from './src/routes/modalidadeRoutes.js';
import agendaRoutes from './src/routes/agendaRoutes.js';

import notificacaoRoutes from './src/routes/notificacoesRoutes.js';
import notificacaoObserver from './src/observers/notificacaoObserver.js';

import { NotificacaoObserver } from './src/observers/notificacaoObserver.js';

import db from './src/config/db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/interacoes', interacaoRoutes);
app.use('/api/agenda', agendaRoutes);

app.use('/api/certificadoParticipacao', certificadoPartRoutes);
app.use('/api', modalidadeRoutes);

app.use('/api/checklist', checklistRoutes);
app.use('/api/agregados', agregadoRoutes);
app.use('/api/participacaoEventos', participacaoEventoRoutes);

app.use('/api/clientes', clienteRoutes);
app.use('/api/relatorios', relatorioRoutes);

app.use('/api/notificacoes', notificacaoRoutes);

app.use("/api/checklistVeiculoAgregado", checklistVeiculoAgregadoRoutes);
app.use("/api/checklistPredios", checklistPredialRoutes);

app.post('/api/eventos/:id/enviar-convites', async (req, res) => {
    try {
        const eventoId = parseInt(req.params.id);
        console.log(`🎉 Enviando convites para evento: ${eventoId}`);
        
        if (!eventoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do evento é obrigatório'
            });
        }

        const resultado = await NotificacaoObserver.notificarNovoEvento(eventoId);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message,
                enviados: resultado.enviados,
                erros: resultado.erros
            });
        } else {
            res.status(400).json({
                success: false,
                message: resultado.error
            });
        }
        
    } catch (error) {
        console.error(' Erro ao enviar convites:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar convites',
            error: error.message
        });
    }
});

notificacaoObserver.iniciar().then(() => {
    console.log(' NotificacaoObserver iniciado com sucesso');
}).catch(error => {
    console.error(' Erro ao iniciar NotificacaoObserver:', error);
});

app.get("/api/certificados", listarCertificados);

app.get('/api/setores', async (req, res) => {
    try {
        const [setores] = await db.promise().query('SELECT * FROM Setor');
        res.json(setores);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar setores' });
    }
});

app.post('/confirmarEvento', (req, res) => {
    const { resposta, justificativa } = req.body;

    console.log("Decisão:", resposta);
    console.log("Justificativa:", justificativa);

    res.status(200).json({ mensagem: 'Resposta registrada com sucesso no servidor!' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        services: {
            notifications: 'active',
            database: 'connected'
        }
    });
});

app.post('/api/testar-convites-manual', async (req, res) => {
    try {
        const { eventoId } = req.body;
        console.log(` Testando convites manualmente para evento: ${eventoId}`);
        
        if (!eventoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do evento é obrigatório'
            });
        }

        const resultado = await NotificacaoObserver.notificarNovoEvento(parseInt(eventoId));
        
        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message,
                enviados: resultado.enviados,
                erros: resultado.erros
            });
        } else {
            res.status(400).json({
                success: false,
                message: resultado.error
            });
        }
        
    } catch (error) {
        console.error(' Erro no teste manual:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no teste manual',
            error: error.message
        });
    }
});

app.get('/api/testar-sistema', async (req, res) => {
    try {
        console.log(' Testando sistema completo...');
        
        const estatisticas = await notificacaoObserver.obterEstatisticas();
        
        const processadas = await notificacaoObserver.processarNotificacoesPendentes();
        res.json({
            success: true,
            message: 'Sistema testado com sucesso!',
            estatisticas,
            notificacoes_processadas: processadas,
            endpoints: {
                notificacoes: 'http://localhost:3000/api/notificacoes',
                estatisticas: 'http://localhost:3000/api/notificacoes/estatisticas',
                enviar_convites: 'POST http://localhost:3000/api/eventos/{id}/enviar-convites'
            }
        });
        
    } catch (error) {
        console.error(' Erro no teste do sistema:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no teste do sistema',
            error: error.message
        });
    }
});

app.get('/api/eventos-info', async (req, res) => {
    try {
        const [eventos] = await db.promise().query(`
            SELECT e.ID_Evento, e.Nome_Evento, e.Data_Evento, 
                   c.Nome_Col as criador,
                   COUNT(pe.ID_Colaborador) as total_participantes
            FROM Evento e
            LEFT JOIN Colaboradores c ON e.Criado_Por = c.ID_colaborador
            LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento
            GROUP BY e.ID_Evento
            ORDER BY e.ID_Evento DESC
        `);

        res.json({
            success: true,
            total_eventos: eventos.length,
            eventos: eventos
        });
        
    } catch (error) {
        console.error(' Erro ao buscar eventos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar eventos',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Notificações: http://localhost:3000/api/notificacoes`);
    console.log(`Health Check: http://localhost:3000/api/health`);
    console.log(`Teste Sistema: http://localhost:3000/api/testar-sistema`);
    console.log(`Enviar Convites: POST http://localhost:3000/api/eventos/{id}/enviar-convites`);
    console.log(`Ver Eventos: http://localhost:3000/api/eventos-info`);
    
});