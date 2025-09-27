import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

import db from './src/config/db.js';
import transporter from './src/mailer.js';
import jwt from 'jsonwebtoken';

const notificarColaboradoresEvento = async (eventoId, setoresIds) => {
    try {
        if (!setoresIds || setoresIds.length === 0) {
            console.log(' Nenhum setor selecionado para notificação');
            return;
        }

        console.log(` Iniciando notificação para evento ${eventoId}, setores:`, setoresIds);

        const [colaboradores] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor 
            WHERE c.Setor IN (?)
        `, [setoresIds]);

        if (colaboradores.length === 0) {
            console.log('📭 Nenhum colaborador encontrado nos setores selecionados');
            return;
        }

        console.log(` Encontrados ${colaboradores.length} colaboradores para notificar`);

        const [eventos] = await db.promise().query(`
            SELECT * FROM Evento WHERE ID_Evento = ?
        `, [eventoId]);
        
        if (eventos.length === 0) {
            console.log(' Evento não encontrado para notificação');
            return;
        }
        
        const evento = eventos[0];
        const dataFormatada = new Date(evento.Data_Evento).toLocaleDateString('pt-BR');
        const horaFormatada = new Date(evento.Data_Evento).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', minute: '2-digit' 
        });

        for (const colaborador of colaboradores) {
            try {
                await db.promise().query(`
                    INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) 
                    VALUES (?, ?, 1) 
                    ON DUPLICATE KEY UPDATE ID_Status = 1
                `, [eventoId, colaborador.ID_colaborador]);
            } catch (error) {
                console.log(` Erro ao registrar participação para ${colaborador.Nome_Col}:`, error);
            }
        }

        let emailsEnviados = 0;
        for (const colaborador of colaboradores) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER || 'sistema@newelog.com',
                    to: colaborador.Email,
                    subject: ` Novo Evento: ${evento.Nome_Evento} - Newe Log`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <style>
                                body { font-family: Arial, sans-serif; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
                                .evento-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2563eb; }
                                .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1> Novo Evento Criado!</h1>
                                    <p>Newe Log - Sistema de Eventos</p>
                                </div>
                                
                                <div class="content">
                                    <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                                    <p>Um novo evento foi criado e você está convidado(a)!</p>
                                    
                                    <div class="evento-info">
                                        <h2 style="margin-top: 0; color: #2563eb;">${evento.Nome_Evento}</h2>
                                        <p><strong> Data:</strong> ${dataFormatada}</p>
                                        <p><strong> Hora:</strong> ${horaFormatada}</p>
                                        <p><strong> Local:</strong> ${evento.Local_Evento}</p>
                                        <p><strong> Descrição:</strong> ${evento.Descricao || 'Sem descrição adicional'}</p>
                                        <p><strong> Seu Setor:</strong> ${colaborador.Nome_Setor || 'Não informado'}</p>
                                    </div>
                                    
                                    <p>Por favor, confirme sua presença o mais breve possível:</p>
                                    
                                    <div style="text-align: center;">
                                        <a href="http://localhost:${PORT}" class="btn">
                                             Confirmar Minha Presença
                                        </a>
                                    </div>
                                    
                                    <p style="font-size: 14px; color: #6b7280;">
                                        <em>Prazo para confirmação: 48 horas antes do evento</em>
                                    </p>
                                </div>
                                
                                <div class="footer">
                                    <p>Este é um email automático, por favor não responda.</p>
                                    <p>Newe Log &copy; ${new Date().getFullYear()}</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };

                await transporter.sendMail(mailOptions);
                emailsEnviados++;
                console.log(` Email enviado para: ${colaborador.Email}`);

            } catch (error) {
                console.error(` Erro ao enviar email para ${colaborador.Email}:`, error);
            }
        }

        console.log(` Resumo: ${emailsEnviados}/${colaboradores.length} emails enviados com sucesso`);

    } catch (error) {
        console.error(' Erro crítico na notificação de evento:', error);
    }
};

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            mensagem: 'Token de acesso necessário' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_super_secreto', (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                mensagem: 'Token inválido ou expirado' 
            });
        }
        req.user = user;
        next();
    });
};

app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('=== TENTATIVA DE LOGIN ===');
        const { email, senha } = req.body;

        console.log('Email recebido:', email);

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                mensagem: 'Email e senha são obrigatórios'
            });
        }

        const [users] = await db.promise().query(
            `SELECT c.*, s.Nome_Setor 
             FROM Colaboradores c 
             LEFT JOIN Setor s ON c.Setor = s.ID_Setor 
             WHERE c.Email = ?`, 
            [email]
        );

        console.log('Usuários encontrados:', users.length);

        if (users.length === 0) {
            console.log('Email não encontrado');
            return res.status(401).json({
                success: false,
                mensagem: 'Email não encontrado'
            });
        }

        const user = users[0];
        console.log('Usuário:', user.Nome_Col);

        let senhaValida = false;
        
        try {
            if (user.Senha.startsWith('$2a$') || user.Senha.startsWith('$2b$')) {
                senhaValida = await bcrypt.compare(senha, user.Senha);
                console.log('Método: bcrypt - Resultado:', senhaValida);
            } else {
                senhaValida = (senha === user.Senha);
                console.log('Método: texto puro - Resultado:', senhaValida);
            }
        } catch (error) {
            console.log('Erro na verificação:', error);
            senhaValida = (senha === user.Senha);
            console.log('Método: fallback - Resultado:', senhaValida);
        }

        if (!senhaValida) {
            console.log('Senha inválida');
            return res.status(401).json({
                success: false,
                mensagem: 'Senha incorreta'
            });
        }

        console.log('Senha válida!');

        const token = jwt.sign(
            {
                id: user.ID_colaborador,
                email: user.Email,
                nome: user.Nome_Col,
                setor: user.Setor,
                nivel: user.Nivel_Acesso,
                nomeSetor: user.Nome_Setor
            },
            process.env.JWT_SECRET || 'seu_segredo_super_secreto',
            { expiresIn: '24h' }
        );

        console.log('Login realizado com sucesso para:', user.Nome_Col);
        res.json({
            success: true,
            token: token,
            usuario: {
                id: user.ID_colaborador,
                nome: user.Nome_Col,
                email: user.Email,
                setor: user.Setor,
                nivel: user.Nivel_Acesso,
                nomeSetor: user.Nome_Setor
            },
            mensagem: 'Login realizado com sucesso'
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro interno do servidor'
        });
    }
});

app.get('/api/auth/confirmar/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO'
        );

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Confirmado - Newe Log</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: #28a745; }
                    .info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1 class="success">✅ Email Confirmado com Sucesso!</h1>
                <div class="info">
                    <p>Olá <strong>${decoded.nome}</strong>!</p>
                    <p>Seu email <strong>${decoded.email}</strong> foi confirmado.</p>
                    <p>Agora você pode fazer login no sistema.</p>
                </div>
                <a href="/" style="color: #007bff; text-decoration: none;">→ Ir para o Login</a>
            </body>
            </html>
        `);

    } catch (error) {
        res.status(400).send(`
            <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #dc3545;"> Link Inválido ou Expirado</h1>
                <p>Este link de confirmação não é válido ou expirou.</p>
                <a href="/">Voltar ao Login</a>
            </body>
            </html>
        `);
    }
});

app.get('/api/colaboradores', autenticarToken, async (req, res) => {
    try {
        const [colaboradores] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor
            ORDER BY c.Nome_Col
        `);
        
        res.json({
            success: true,
            colaboradores: colaboradores
        });
    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar colaboradores'
        });
    }
});

app.get('/api/colaboradores/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const [colaboradores] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor
            WHERE c.ID_colaborador = ?
        `, [id]);
        
        if (colaboradores.length === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            colaborador: colaboradores[0]
        });
    } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar colaborador'
        });
    }
});

app.post('/api/colaboradores', autenticarToken, async (req, res) => {
    try {
        const { nome, email, setor, cpf, telefone, nivel_acesso, senha } = req.body;
        
        const [existentes] = await db.promise().query(
            'SELECT ID_colaborador FROM Colaboradores WHERE Email = ?',
            [email]
        );
        
        if (existentes.length > 0) {
            return res.status(400).json({
                success: false,
                mensagem: 'Já existe um colaborador com este email'
            });
        }
        
        const senhaHash = await bcrypt.hash(senha || '123456', 10);
        
        const [result] = await db.promise().query(
            `INSERT INTO Colaboradores (Nome_Col, Email, Setor, CPF, Telefone, Nivel_Acesso, Senha) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome, email, setor, cpf, telefone, nivel_acesso, senhaHash]
        );
        
        res.json({
            success: true,
            mensagem: 'Colaborador cadastrado com sucesso',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erro ao cadastrar colaborador:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao cadastrar colaborador'
        });
    }
});

app.put('/api/colaboradores/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, setor, cpf, telefone, nivel_acesso, senha } = req.body;
        
        let query = `UPDATE Colaboradores SET 
            Nome_Col = ?, Email = ?, Setor = ?, CPF = ?, 
            Telefone = ?, Nivel_Acesso = ?`;
        
        let params = [nome, email, setor, cpf, telefone, nivel_acesso];
        
        if (senha) {
            const senhaHash = await bcrypt.hash(senha, 10);
            query += `, Senha = ?`;
            params.push(senhaHash);
        }
        
        query += ` WHERE ID_colaborador = ?`;
        params.push(id);
        
        const [result] = await db.promise().query(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            mensagem: 'Colaborador atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar colaborador:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao atualizar colaborador'
        });
    }
});

app.delete('/api/colaboradores/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.promise().query(
            'DELETE FROM Colaboradores WHERE ID_colaborador = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            mensagem: 'Colaborador excluído com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir colaborador:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao excluir colaborador'
        });
    }
});

app.get('/api/eventos', autenticarToken, async (req, res) => {
    try {
        const [eventos] = await db.promise().query(`
            SELECT e.*, 
                   COUNT(pe.ID_Colaborador) as total_participantes,
                   SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as confirmados,
                   SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as recusados
            FROM Evento e
            LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento
            GROUP BY e.ID_Evento
            ORDER BY e.Data_Evento DESC
        `);
        
        res.json({
            success: true,
            eventos: eventos
        });
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar eventos'
        });
    }
});

app.get('/api/eventos/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const [eventos] = await db.promise().query(`
            SELECT e.*, 
                   COUNT(pe.ID_Colaborador) as total_participantes,
                   SUM(CASE WHEN pe.ID_Status = 2 THEN 1 ELSE 0 END) as confirmados,
                   SUM(CASE WHEN pe.ID_Status = 3 THEN 1 ELSE 0 END) as recusados
            FROM Evento e
            LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento
            WHERE e.ID_Evento = ?
            GROUP BY e.ID_Evento
        `, [id]);
        
        if (eventos.length === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Evento não encontrado'
            });
        }
        
        const [participantes] = await db.promise().query(`
            SELECT pe.*, c.Nome_Col, c.Email, s.Nome_Status
            FROM Participacao_Evento pe
            JOIN Colaboradores c ON pe.ID_Colaborador = c.ID_colaborador
            JOIN Status_Participacao s ON pe.ID_Status = s.ID_Status
            WHERE pe.ID_Evento = ?
        `, [id]);
        
        res.json({
            success: true,
            evento: eventos[0],
            participantes: participantes
        });
    } catch (error) {
        console.error('Erro ao buscar evento:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar evento'
        });
    }
});

app.post('/api/eventos', autenticarToken, async (req, res) => {
    try {
        const { nome_evento, data_evento, local_evento, descricao, setores_notificados } = req.body;
        
        const [result] = await db.promise().query(
            `INSERT INTO Evento (Nome_Evento, Data_Evento, Local_Evento, Descricao) 
             VALUES (?, ?, ?, ?)`,
            [nome_evento, data_evento, local_evento, descricao]
        );
        
        if (setores_notificados && setores_notificados.length > 0) {
            notificarColaboradoresEvento(result.insertId, setores_notificados)
                .then(() => console.log('🎉 Notificações de evento processadas com sucesso'))
                .catch(err => console.error('❌ Erro nas notificações:', err));
        }
        
        res.json({
            success: true,
            mensagem: 'Evento criado com sucesso',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao criar evento'
        });
    }
});

app.put('/api/eventos/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_evento, data_evento, local_evento, descricao } = req.body;
        
        const [result] = await db.promise().query(
            `UPDATE Evento SET Nome_Evento = ?, Data_Evento = ?, Local_Evento = ?, Descricao = ?
             WHERE ID_Evento = ?`,
            [nome_evento, data_evento, local_evento, descricao, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Evento não encontrado'
            });
        }
        
        res.json({
            success: true,
            mensagem: 'Evento atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao atualizar evento'
        });
    }
});

app.delete('/api/eventos/:id', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.promise().query(
            'DELETE FROM Participacao_Evento WHERE ID_Evento = ?',
            [id]
        );
        
        const [result] = await db.promise().query(
            'DELETE FROM Evento WHERE ID_Evento = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                mensagem: 'Evento não encontrado'
            });
        }
        
        res.json({
            success: true,
            mensagem: 'Evento excluído com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao excluir evento'
        });
    }
});

app.get('/api/meus-eventos', autenticarToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [eventos] = await db.promise().query(`
            SELECT e.*, pe.ID_Status, pe.justificativa, s.Nome_Status
            FROM Evento e
            LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento AND pe.ID_Colaborador = ?
            LEFT JOIN Status_Participacao s ON pe.ID_Status = s.ID_Status
            WHERE e.Data_Evento >= CURDATE()
            ORDER BY e.Data_Evento ASC
        `, [userId]);
        
        res.json({
            success: true,
            eventos: eventos
        });
    } catch (error) {
        console.error('Erro ao buscar meus eventos:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar eventos'
        });
    }
});

app.post('/api/confirmar-presenca', autenticarToken, async (req, res) => {
    try {
        const { eventoId, resposta, justificativa } = req.body;
        const userId = req.user.id;
        
        let statusId;
        if (resposta === 'aceito') statusId = 2;
        else if (resposta === 'recusado') statusId = 3;
        else statusId = 1;
        
        await db.promise().query(`
            INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status, justificativa) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE ID_Status = ?, justificativa = ?, data_resposta = NOW()
        `, [eventoId, userId, statusId, justificativa, statusId, justificativa]);

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

app.get('/api/notificacoes', autenticarToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [notificacoes] = await db.promise().query(`
            SELECT e.*, 'evento' as tipo
            FROM Evento e
            LEFT JOIN Participacao_Evento pe ON e.ID_Evento = pe.ID_Evento AND pe.ID_Colaborador = ?
            WHERE e.Data_Evento >= CURDATE() 
            AND (pe.ID_Status IS NULL OR pe.ID_Status = 1)
            ORDER BY e.Data_Evento ASC
        `, [userId]);
        
        res.json({
            success: true,
            notificacoes: notificacoes
        });
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        res.status(500).json({
            success: false,
            mensagem: 'Erro ao buscar notificações'
        });
    }
});

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
        console.log(' Tabelas auxiliares já existem ou erro ignorável');
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

        const linkConfirmacao = `http://localhost:${PORT}/api/auth/confirmar/${tokenConfirmacao}`;

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
                <a href="/">↩ Voltar ao Login</a>
            </body>
            </html>
        `);
    }
});

const iniciarSistemaAutomatico = async () => {
    await criarTabelasAuxiliares();
    await observarNovosColaboradores();
    setInterval(observarNovosColaboradores, 120000);
};

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

app.listen(PORT, async () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Acesse: http://localhost:${PORT}`);
    
    await iniciarSistemaAutomatico();
    
    try {
        const iniciarObservadorEventos = await import('./src/observadorEventos.js');
        if (iniciarObservadorEventos.default) {
            await iniciarObservadorEventos.default();
        }
    } catch (error) {
        console.log( error.message);
    }
});

export default app;