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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});