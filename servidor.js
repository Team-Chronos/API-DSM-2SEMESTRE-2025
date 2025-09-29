import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import eventoRoutes from './src/routes/eventoRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import agregadoRoutes from './src/routes/agregadoRoutes.js';
import './src/routes/notificacaoObserver.js'; 
import participacaoEventoRoutes from './src/routes/participacaoEventoRoutes.js';
import certificadoPartRoutes from './src/routes/certificadoPartRoutes.js';
import db from './src/config/db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/eventos', eventoRoutes);

app.use('/api/participacaoEventos', participacaoEventoRoutes);

app.use('/api/certificadoParticipacao', certificadoPartRoutes)

app.use('/api/agregados', agregadoRoutes);
app.use('/api/participacaoEventos', participacaoEventoRoutes);

app.get('/api/setores', async (req, res) => {
    try {
        const [setores] = await db.promise().query('SELECT * FROM Setor');
        res.json(setores);
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar setores' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/confirmarEvento', (req, res) => {
    const { resposta, justificativa } = req.body;

    console.log('Resposta recebida do cliente:');
    console.log(`- Decisão: ${resposta}`); 
    console.log(`- Justificativa: ${justificativa}`); 

    res.status(200).json({ mensagem: 'Resposta registrada com sucesso no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
