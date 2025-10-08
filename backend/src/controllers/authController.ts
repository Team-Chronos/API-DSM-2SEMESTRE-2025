import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
        const [results] = (await Colaborador.findByEmail(email)) as [RowDataPacket[], any];

        if (results.length === 0) {
            return res.status(401).json({ mensagem: "Email ou senha incorretos!" });
        }

        const usuario = results[0] as any;

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