import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { listarCertificados } from "./src/controllers/certificadoController.js";
import eventoRoutes from './src/routes/eventoRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import agregadoRoutes from './src/routes/agregadoRoutes.js';
import './src/routes/notificacaoObserver.js'; 
import participacaoEventoRoutes from './src/routes/participacaoEventoRoutes.js';
import certificadoPartRoutes from './src/routes/certificadoPartRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js'
import interacaoRoutes from './src/routes/interacaoRoutes.js'
import relatorioRoutes from './src/routes/relatorioRoutes.js'
import checklistVeiculoAgregadoRoutes from './src/routes/checklistVeiculoAgregadoRoutes.js'
import checklistPredialRoutes from './src/routes/checklistPredialRoutes.js'
import checklistRoutes from './src/routes/checklistRoutes.js';
import checklistVeiculoFrotaRoutes from "./src/routes/checklistVeiculoFrotaRoutes.js"


import modalidadeRoutes from './src/routes/modalidadeRoutes.js';
import agendaRoutes from './src/routes/agendaRoutes.js';
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

app.use('/api/certificadoParticipacao', certificadoPartRoutes)
app.use('/api', modalidadeRoutes);

app.use('/api/checklist', checklistRoutes);

app.use('/api/agregados', agregadoRoutes);
app.use('/api/participacaoEventos', participacaoEventoRoutes);
app.use('/api/checklist', checklistRoutes);


app.use('/api/clientes', clienteRoutes)
app.use('/api/relatorios', relatorioRoutes)
app.use('/api/certificadoParticipacao', certificadoPartRoutes);
app.get("/api/certificados", listarCertificados);
app.get('/api/setores', async (req, res) => {
    try {
        const [setores] = await db.promise().query('SELECT * FROM Setor');
        res.json(setores);
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar setores' });
    }
});

app.post('/confirmarEvento', (req, res) => {
    const { resposta, justificativa } = req.body;

    console.log('Resposta recebida do cliente:');
    console.log(`- Decisão: ${resposta}`); 
    console.log(`- Justificativa: ${justificativa}`); 

    res.status(200).json({ mensagem: 'Resposta registrada com sucesso no servidor!' });
});

app.use("/api/checklistVeiculoAgregado", checklistVeiculoAgregadoRoutes)

app.use("/api/checklistPredios", checklistPredialRoutes)
app.use("/api/checklistVeiculoFrota", checklistVeiculoFrotaRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
