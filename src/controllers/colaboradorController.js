import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { enviarEmailConfirmacao } from './authController.js'; 

export const criarColaborador = async (req, res) => {
    const { nome, email, senha, telefone, cpf, setor } = req.body;
    if (!nome || !email || !senha || !telefone || !cpf || !setor) {
        return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }
    try {
        const [emailResults] = await Colaborador.findByEmail(email);
        if (emailResults.length > 0) return res.status(400).json({ mensagem: "Email já cadastrado!" });

        const [cpfResults] = await Colaborador.findByCpf(cpf);
        if (cpfResults.length > 0) return res.status(400).json({ mensagem: "CPF já cadastrado!" });

        const senhaHash = await bcrypt.hash(senha, 10);
        await Colaborador.create({ nome, email, senhaHash, telefone, cpf, setor });

        const tokenConfirmacao = jwt.sign({ email }, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', { 
            expiresIn: '24h' 
        });

        await enviarEmailConfirmacao(email, tokenConfirmacao);

        res.status(201).json({ 
            mensagem: "Usuário cadastrado com sucesso! Verifique seu email para confirmar o cadastro." 
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
};

export const listarColaboradores = async (req, res) => {
    try {
        const [results] = await Colaborador.findAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar colaboradores." });
    }
};

export const obterColaboradorPorId = async (req, res) => {
    try {
        const [results] = await Colaborador.findById(req.params.id);
        if (results.length === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar colaborador." });
    }
};

export const atualizarColaborador = async (req, res) => {
    try {
        const [result] = await Colaborador.updateById(req.params.id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json({ mensagem: "Colaborador atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar colaborador." });
    }
};

export const excluirColaborador = async (req, res) => {
    try {
        const [result] = await Colaborador.deleteById(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        res.json({ mensagem: "Colaborador excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao excluir colaborador." });
    }
};