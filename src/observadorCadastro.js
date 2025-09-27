import db from './config/db.js';
import transporter from './mailer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const verificarNovosColaboradores = async () => {
    try {
        const [results] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor 
            WHERE c.ID_colaborador NOT IN (
                SELECT ID_colaborador FROM colaboradores_emails_enviados
            ) OR c.ID_colaborador IN (
                SELECT ID_colaborador FROM colaboradores_emails_enviados WHERE email_enviado = 0
            )
            LIMIT 5
        `);
        
        if (results.length > 0) {
            for (const colaborador of results) {
                console.log(' Processando colaborador:', colaborador.Email);
                await enviarEmailConfirmacao(colaborador);
                
                await db.promise().query(`
                    INSERT INTO colaboradores_emails_enviados (ID_colaborador, email_enviado, data_envio) 
                    VALUES (?, 1, NOW()) 
                    ON DUPLICATE KEY UPDATE email_enviado = 1, data_envio = NOW()
                `, [colaborador.ID_colaborador]);
                
                console.log(' Email enviado para:', colaborador.Email);
            }
        }
    } catch (error) {
        console.error(' Erro no observador:', error);
    }
};

const enviarEmailConfirmacao = async (colaborador) => {
    try {
        const tokenConfirmacao = jwt.sign(
            { 
                email: colaborador.Email,
                id: colaborador.ID_colaborador,
                nome: colaborador.Nome_Col
            }, 
            process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', 
            { expiresIn: '12h' } 
        );

        const linkConfirmacao = `http://localhost:3000/api/auth/confirmar/${tokenConfirmacao}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'sistema@newelog.com',
            to: colaborador.Email,
            subject: ' Confirmação de Cadastro - Newe Log',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0;">Newe Log</h1>
                        <p style="margin: 5px 0 0 0;">Logística Integrada</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <h2 style="color: #333;">Bem-vindo, ${colaborador.Nome_Col}! </h2>
                        
                        <p>Seu cadastro foi realizado com sucesso no sistema Newe Log.</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #495057; margin-top: 0;">Seus Dados de Acesso:</h3>
                            <p><strong>Email:</strong> ${colaborador.Email}</p>
                            <p><strong>Setor:</strong> ${colaborador.Nome_Setor}</p>
                            <p><strong>Nível de Acesso:</strong> ${colaborador.Nivel_Acesso}</p>
                        </div>
                        
                        <p><strong>Para ativar sua conta, confirme seu email:</strong></p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${linkConfirmacao}" 
                               style="background: #28a745; color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 5px; font-size: 16px;
                                      display: inline-block; font-weight: bold;">
                                Confirmar Meu Email
                            </a>
                        </div>
                        
                        <p style="color: #6c757d; font-size: 14px;">
                            <strong>Importante:</strong> Este link expira em 72 horas. 
                            Após a confirmação, você poderá fazer login no sistema.
                        </p>
                        
                        <div style="border-top: 1px solid #dee2e6; margin-top: 30px; padding-top: 20px;">
                            <p style="color: #6c757d; font-size: 12px;">
                                Se você não realizou este cadastro, ignore este email ou 
                                entre em contato com o administrador do sistema.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
        
    } catch (error) {
        console.error(' Erro ao enviar email para', colaborador.Email, error);
        return false;
    }
};

const criarTabelaControle = async () => {
    try {
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS colaboradores_emails_enviados (
                ID_colaborador INT PRIMARY KEY,
                email_enviado BOOLEAN DEFAULT FALSE,
                data_envio DATETIME,
                tentativas INT DEFAULT 0,
                FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador)
            )
        `);
        console.log('Tabela de controle de emails verificada/criada');
    } catch (error) {
        console.error(' Erro ao criar tabela de controle:', error);
    }
};

const iniciarObservador = async () => {
    await criarTabelaControle();
    
    await verificarNovosColaboradores();
    
    setInterval(verificarNovosColaboradores, 60000);
    
    console.log(' Observador de novos colaboradores INICIADO');
};

export default iniciarObservador;