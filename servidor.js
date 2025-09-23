import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import eventoRoutes from './src/models/eventoRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/eventos', eventoRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/adm/inicio.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/adm/inicio.html'));
});

app.get('/confirmarEvento.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/confirmarEvento.html'));
});

app.get('/agregado.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/agregado.html'));
});

app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Sistema de email: ${process.env.EMAIL_USER ? 'Configurado' : 'Não configurado'}`);
    console.log(`  Banco de dados: ${process.env.DB_HOST}`);
    console.log(` Acesse: http://localhost:${PORT}`);
});