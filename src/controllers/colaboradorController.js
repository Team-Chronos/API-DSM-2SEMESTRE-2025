import { enviarEmailConfirmacao } from './authController.js';
import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const criarColaborador = async (req, res) => {
  const { nome, email, senha, telefone, cpf, setor } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const result = await Colaborador.create({ nome, email, senhaHash, telefone, cpf, setor });

    const tokenConfirmacao = jwt.sign(
        { email }, 
        process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', 
        { expiresIn: '24h' }
    );

    await enviarEmailConfirmacao(email, tokenConfirmacao);

    res.status(201).json({ mensagem: "Colaborador criado e email de confirmação enviado!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao criar colaborador" });
  }
};

export const listarColaboradores = async (req, res) => {
  try {
    const [results] = await Colaborador.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar colaboradores" });
  }
};

export const obterColaboradorPorId = async (req, res) => {
  try {
    const [results] = await Colaborador.findById(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Colaborador não encontrado" });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar colaborador" });
  }
};

export const atualizarColaborador = async (req, res) => {
  try {
    await Colaborador.updateById(req.params.id, req.body);
    res.json({ mensagem: "Colaborador atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar colaborador" });
  }
};

export const excluirColaborador = async (req, res) => {
  try {
    await Colaborador.deleteById(req.params.id);
    res.json({ mensagem: "Colaborador excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir colaborador" });
  }
};