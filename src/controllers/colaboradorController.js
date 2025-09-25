import Colaborador from '../models/colaborador.js';
import bcrypt from 'bcrypt';


export const criarColaborador = async (req, res) => {
    const { nome, email, senha, telefone, cpf, setor, lo } = req.body;
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

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
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

export const salvarLocalidade = async (req, res) => {
    const { colaboradorId, localidade } = req.body;

    if (!colaboradorId || !localidade) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    try {
        await Colaborador.updateLocalidade(colaboradorId, localidade);
        res.status(200).json({ mensagem: "Localidade salva com sucesso!" });
    } catch (err) {
        console.error("Erro ao salvar localidade:", err);
        res.status(500).json({ mensagem: "Erro interno ao salvar localidade." });
    }
};