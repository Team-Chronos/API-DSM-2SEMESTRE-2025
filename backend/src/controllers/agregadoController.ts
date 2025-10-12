import Agregado from '../models/agregado.js';

export const criarAgregado = async (req: any, res: any) => {
    try {
        const dados = { ...req.body };
        if (dados.cpf) dados.cpf = dados.cpf.replace(/\D/g, '');
        if (dados.cnpj) dados.cnpj = dados.cnpj.replace(/\D/g, '');
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g, '');
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g, '');
        if (dados.rg) dados.rg = dados.rg.replace(/\D/g, '');

        await Agregado.create(dados);
        res.status(201).json({ mensagem: "Agregado cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar agregado:", error);
        res.status(500).json({ mensagem: "Erro ao cadastrar agregado. Verifique se CPF, CNPJ, RG, PIS ou Placa já existem no sistema." });
    }
};