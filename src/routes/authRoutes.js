import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../mailer.js';

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [results] = await Colaborador.findByEmail(email);

        if (results.length === 0) {
            return res.status(401).json({ mensagem: "Email ou senha incorretos!" });
        }

        const usuario = results[0];

        if (!usuario.verified) {
            return res.status(401).json({ mensagem: "Por favor, confirme seu email antes de fazer login!" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Email ou senha incorretos!" });
        }

        const payload = { id: usuario.ID_colaborador, nome: usuario.Nome_Col, setor: usuario.Setor };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', { expiresIn: '8h' });

        res.json({ mensagem: "Login realizado com sucesso!", token: token });

    } catch (err) {
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
};

export const enviarEmailConfirmacao = async (destinatario, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: 'Confirmação de Cadastro - Newe Log',
        html: `
            <h2>Confirmação de Cadastro</h2>
            <p>Olá! Clique no link abaixo para confirmar seu cadastro:</p>
            <a href="http://localhost:3000/api/auth/confirmar/${token}">Confirmar Email</a>
            <p>Se você não realizou este cadastro, ignore este email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de confirmação enviado com sucesso para:', destinatario);
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
    }
};

export const confirmarEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO');
        
        const [results] = await Colaborador.findByEmail(decoded.email);
        if (results.length === 0) {
            return res.status(400).send('Usuário não encontrado.');
        }

        const user = results[0];
        
        await Colaborador.confirmarEmail(decoded.email);
        
        res.send(`
            <html>
                <body>
                    <h2>E-mail confirmado com sucesso!</h2>
                    <p>Agora você pode fazer login no sistema.</p>
                    <a href="/login.html">Ir para Login</a>
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
};