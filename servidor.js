import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Colaborador from './src/models/colaborador.js';

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

app.get('/api/auth/confirmar/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO');
        const [results] = await Colaborador.findByEmail(decoded.email);
        
        if (results.length === 0) {
            return res.status(400).send('Usuário não encontrado.');
        }

        await Colaborador.confirmarEmail(decoded.email);
        
        res.send(`
            <html>
                <body>
                    <h2>E-mail confirmado com sucesso!</h2>
                    <p>Agora você pode fazer login no sistema.</p>
                    <a href="/">Ir para Login</a>
                </body>
            </html>
        `);
    } catch (err) {
        res.status(400).send(`
            <html>
                <body>
                    <h2>Token inválido ou expirado.</h2>
                    <p>Por favor, solicite um novo link de confirmação.</p>
                </body>
            </html>
        `);
    }
});

app.post('/api/notificar-evento', async (req, res) => {
    const { idEvento, idColaborador, resposta, motivo } = req.body;

    try {
        const [eventoResults] = await Evento.findById(idEvento);
        if (eventoResults.length === 0) {
            return res.status(404).json({ mensagem: "Evento não encontrado" });
        }

        const evento = eventoResults[0];
        
        const [organizadorResults] = await Colaborador.findById(evento.criado_por);
        if (organizadorResults.length === 0) {
            return res.status(404).json({ mensagem: "Organizador não encontrado" });
        }

        const organizador = organizadorResults[0];
        
        const [colaboradorResults] = await Colaborador.findById(idColaborador);
        const colaborador = colaboradorResults[0];

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: organizador.Email,
            subject: `Resposta de Evento - ${colaborador.Nome_Col}`,
            html: `
                <h2>Nova Resposta de Evento</h2>
                <p><strong>Colaborador:</strong> ${colaborador.Nome_Col}</p>
                <p><strong>Evento:</strong> ${evento.titulo}</p>
                <p><strong>Resposta:</strong> ${resposta === 'aceito' ? ' Confirmou presença' : ' Recusou presença'}</p>
                ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
                <p><strong>Data da resposta:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ 
            mensagem: "Organizador notificado com sucesso",
            resposta: resposta,
            colaborador: colaborador.Nome_Col
        });

    } catch (error) {
        console.error('Erro ao notificar organizador:', error);
        res.status(500).json({ mensagem: "Erro ao notificar organizador" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, './public/home.html'));
});

app.get('/adm/inicio.html', (req, res) => {
    res.sendFile(path.join(__dirname, './public/adm/inicio.html'));
});

app.get('/confirmarEvento.html', (req, res) => {
    res.sendFile(path.join(__dirname, './public/confirmarEvento.html'));
});

app.get('/agregado.html', (req, res) => {
    res.sendFile(path.join(__dirname, './public/agregado.html'));
});

app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Sistema de email: ${process.env.EMAIL_USER ? 'Configurado' : 'Não configurado'}`);
    console.log(`  Banco de dados: ${process.env.DB_HOST}`);
    console.log(` Acesse: http://localhost:${PORT}`);
});