import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import eventoRoutes from './src/routes/eventoRoutes.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/colaboradores', colaboradorRoutes);

app.use('/api/eventos', eventoRoutes);

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