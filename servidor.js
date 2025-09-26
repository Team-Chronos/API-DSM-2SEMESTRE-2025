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
app.use(express.static(path.join(__dirname, 'public')));

import authRoutes from './src/routes/authRoutes.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import iniciarObservadorEventos from './src/observadorEventos.js';

app.use('/api/auth', authRoutes);
app.use('/api/colaboradores', colaboradorRoutes);

import db from './src/config/db.js';
import transporter from './src/mailer.js';
import jwt from 'jsonwebtoken';

const criarTabelasAuxiliares = async () => {
    try {
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS sistema_emails_enviados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ID_colaborador INT NOT NULL,
                email_enviado BOOLEAN DEFAULT FALSE,
                data_envio DATETIME,
                tentativas INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_colaborador (ID_colaborador)
            )
        `);
        
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS sistema_confirmacoes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ID_colaborador INT NOT NULL,
                token_confirmacao VARCHAR(500),
                data_confirmacao DATETIME,
                confirmed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_colaborador (ID_colaborador)
            )
        `);
        
        console.log(' Tabelas auxiliares do sistema verificadas/criadas');
    } catch (error) {
        console.log('  Tabelas auxiliares já existem ou erro ignorável');
    }
};

const enviarEmailAutomatico = async (colaborador) => {
    try {
        const tokenConfirmacao = jwt.sign(
            { 
                id: colaborador.ID_colaborador,
                email: colaborador.Email,
                nome: colaborador.Nome_Col
            }, 
            process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO_AUTOMATICO', 
            { expiresIn: '72h' }
        );

        await db.promise().query(`
            INSERT INTO sistema_confirmacoes (ID_colaborador, token_confirmacao) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE token_confirmacao = ?
        `, [colaborador.ID_colaborador, tokenConfirmacao, tokenConfirmacao]);

        const linkConfirmacao = `http://localhost:${PORT}/api/sistema/confirmar/${tokenConfirmacao}`;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'sistema@newelog.com',
            to: colaborador.Email,
            subject: 'Confirmação de Cadastro - Newe Log',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Bem-vindo à Newe Log!</h2>
                    <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                    <p>Seu cadastro foi realizado com sucesso no nosso sistema.</p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Dados do seu cadastro:</strong></p>
                        <p>Email: ${colaborador.Email}</p>
                        <p>ID: ${colaborador.ID_colaborador}</p>
                    </div>
                    
                    <p>Para ativar sua conta, clique no botão abaixo:</p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${linkConfirmacao}" 
                           style="background: #059669; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                             Confirmar Email
                        </a>
                    </div>
                    
                    <p><em>Este link expira em 72 horas.</em></p>
                    
                    <hr style="margin: 25px 0;">
                    <p style="color: #3470e8ff; font-size: 12px;">
                        Caso não tenha realizado este cadastro, ignore este email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error(' Erro no envio automático:', error);
        return false;
    }
};

const observarNovosColaboradores = async () => {
    try {
        const [results] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor
            LEFT JOIN sistema_emails_enviados se ON c.ID_colaborador = se.ID_colaborador
            WHERE se.ID_colaborador IS NULL 
               OR se.email_enviado = FALSE
            LIMIT 10
        `);

        for (const colaborador of results) {
            console.log(' Detectado novo colaborador:', colaborador.Email);
            
            const emailEnviado = await enviarEmailAutomatico(colaborador);
            
            if (emailEnviado) {
                await db.promise().query(`
                    INSERT INTO sistema_emails_enviados (ID_colaborador, email_enviado, data_envio) 
                    VALUES (?, TRUE, NOW()) 
                    ON DUPLICATE KEY UPDATE email_enviado = TRUE, data_envio = NOW()
                `, [colaborador.ID_colaborador]);
                
                console.log(' Email automático enviado para:', colaborador.Email);
            }
        }
    } catch (error) {
        console.error(' Erro no observador:', error);
    }
};

app.get('/api/sistema/confirmar/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO_AUTOMATICO');
        
        await db.promise().query(`
            UPDATE sistema_confirmacoes 
            SET confirmed = TRUE, data_confirmacao = NOW() 
            WHERE ID_colaborador = ? AND token_confirmacao = ?
        `, [decoded.id, token]);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Confirmado - Newe Log</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: #059669; }
                    .info { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1 class="success"> Email Confirmado com Sucesso!</h1>
                <p>Olá <strong>${decoded.nome}</strong>,</p>
                
                <div class="info">
                    <p>Sua conta foi ativada com sucesso.</p>
                    <p><strong>ID:</strong> ${decoded.id}</p>
                    <p><strong>Email:</strong> ${decoded.email}</p>
                </div>
                
                <p>Agora você pode fazer login no sistema.</p>
                <a href="/" style="color: #2563eb;"> Ir para a Página de Login</a>
                
                <script>
                    setTimeout(() => { window.location.href = '/'; }, 5000);
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(400).send(`
            <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #dc2626;"> Link Inválido ou Expirado</h1>
                <p>Este link de confirmação não é válido.</p>
                <a href="/">Voltar ao Login</a>
            </body>
            </html>
        `);
    }
});

const iniciarSistemaAutomatico = async () => {
    await criarTabelasAuxiliares();
    
    await observarNovosColaboradores();
    
    setInterval(observarNovosColaboradores, 120000);
    
    console.log(' Sistema automático de emails INICIADO');
};


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

app.post('/api/confirmar-presenca', async (req, res) => {
    try {
        const { eventoId, resposta, justificativa } = req.body;
        
        await db.promise().query(`
            INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status, justificativa) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE ID_Status = ?, justificativa = ?
        `, [eventoId, req.user.id, resposta, justificativa, resposta, justificativa]);

        res.json({ 
            success: true, 
            message: 'Presença confirmada com sucesso!',
            resposta: resposta 
        });
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        res.status(500).json({ success: false, message: 'Erro ao confirmar presença' });
    }
});

app.listen(PORT, async () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Email: ${process.env.EMAIL_USER ? 'Configurado' : 'Não configurado'}`);
    console.log(`  Banco: ${process.env.DB_HOST}`);
    console.log(` Acesse: http://localhost:${PORT}`);
    
    await iniciarSistemaAutomatico();
    await iniciarObservadorEventos();
});


export default app;