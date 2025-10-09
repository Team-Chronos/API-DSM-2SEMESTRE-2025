import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import type { OkPacket } from 'mysql2';


export const criarColaborador = async (req: Request, res: Response) => {
    const { nome, email, senha, telefone, cpf, setor} = req.body;
    if (!nome || !email || !senha || !telefone || !cpf || !setor) {
        return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }
    try {
        const [emailResults] = (await Colaborador.findByEmail(email)) as [RowDataPacket[], any];
        if (emailResults.length > 0) return res.status(400).json({ mensagem: "Email já cadastrado!" });

        const [cpfResults] = (await Colaborador.findByCpf(cpf)) as [RowDataPacket[], any];
        if (cpfResults.length > 0) return res.status(400).json({ mensagem: "CPF já cadastrado!" });

        const senhaHash = await bcrypt.hash(senha, 10);
        await Colaborador.create({ nome, email, senhaHash, telefone, cpf, setor });

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
};


export const listarColaboradores = async (req: Request, res: Response) => {
    try {
        const [results] = (await Colaborador.findAll()) as [RowDataPacket[], any];
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao listar colaboradores" });
    }
};


export const obterColaboradorPorId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ mensagem: "ID inválido." });

    try {
        const [results] = (await Colaborador.findById(id)) as [RowDataPacket[], any];
        if (results.length === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar colaborador." });
    }
};


export const atualizarColaborador = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ mensagem: "ID inválido." });

    try {
        const [result] = (await Colaborador.updateById(id, req.body)) as [OkPacket, any];
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json({ mensagem: "Colaborador atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar colaborador." });
    }
};


export const excluirColaborador = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ mensagem: "ID inválido." });

    try {
        const [result] = (await Colaborador.deleteById(id)) as [OkPacket, any];
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json({ mensagem: "Colaborador excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao excluir colaborador." });
    }
};

export const salvarLocalidade = async (req: any, res: any) => {
    const { colaboradorId, localidade } = req.body;

    if (!colaboradorId || !localidade) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    try {
        await Colaborador.updateLocalidade(colaboradorId, localidade);
        res.json({ mensagem: "Localidade salva com sucesso!" });
    } catch (err) {
        console.error("Erro ao salvar localidade:", err);
        res.status(500).json({ mensagem: "Erro interno ao salvar localidade." });
    }
};