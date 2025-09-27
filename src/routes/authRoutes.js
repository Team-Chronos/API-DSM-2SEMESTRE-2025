import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../mailer.js';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
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
});

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

router.post('/registro', async (req, res) => {
    const { nome, email, senha, telefone, cpf, setor } = req.body;

    try {
        const [emailResults] = await Colaborador.findByEmail(email);
        if (emailResults.length > 0) {
            return res.status(400).json({ mensagem: "Email já cadastrado!" });
        }

        const [cpfResults] = await Colaborador.findByCpf(cpf);
        if (cpfResults.length > 0) {
            return res.status(400).json({ mensagem: "CPF já cadastrado!" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await Colaborador.create({
            nome, 
            email, 
            senhaHash, 
            telefone, 
            cpf, 
            setor
        });

        const tokenConfirmacao = jwt.sign(
            { email }, 
            process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', 
            { expiresIn: '24h' }
        );

        await enviarEmailConfirmacao(email, tokenConfirmacao);

        res.status(201).json({ mensagem: "Colaborador criado com sucesso! Verifique seu email para confirmação." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao criar colaborador" });
    }
});

export default router;