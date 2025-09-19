import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/colaboradores', colaboradorRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/confirmarEvento', (req, res) => {
    // 1. Pega os dados enviados pelo front-end
    const { resposta, justificativa } = req.body;

    // 2. Mostra no console do servidor para confirmar que os dados chegaram
    console.log('Resposta recebida do cliente:');
    console.log(`- Decisão: ${resposta}`); // Será 'aceito' ou 'recusado'
    console.log(`- Justificativa: ${justificativa}`); // Será o texto ou uma string vazia

    // 3. AQUI VOCÊ COLOCARIA A LÓGICA DO BANCO DE DADOS
    // Ex: salvar a resposta no banco de dados, associada a um usuário/evento.

    // 4. Envia uma resposta de sucesso de volta para o front-end
    res.status(200).json({ mensagem: 'Resposta registrada com sucesso no servidor!' });
});
// --- FIM DA NOVA ROTA ---

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});