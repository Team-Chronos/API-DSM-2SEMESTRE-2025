import db from '../config/db.js';

export const criarChecklist = async (req, res) => {
    const {
        Responsavel,
        Data_Verificacao,
        Piso_ADM,
        Piso_Operacional,
        Piso_Galpao,
        Piso_Refeitorio,
        Forro_ADM,
        Forro_Operacional,
        Forro_Galpao,
        Forro_Refeitorio,
        Instalacoes_Eletricas,
        Protecao_Raios,
        ArCond_ADM,
        ArCond_Diretoria,
        ArCond_Reuniao,
        ArCond_Operacional,
        Lampadas_ADM,
        Lampadas_Diretoria,
        Lampadas_Reuniao,
        Lampadas_Operacional,
        Lampadas_Galpao,
        Lampadas_Refeitorio,
        Lampadas_BanheiroFem,
        Lampadas_BanheiroMasc,
        Macanetas_OK,
        Mesas_Protecao_OK,
        Condicoes_Paleteiras,
        Organizacao_Local,
        Cameras_OK,
        Balanca_Condicao,
        Data_Afericao_Balanca,
        Condicoes_Mictorios,
        Data_Limpeza_Bebedouro,
        Data_Prox_Dedetizacao,
        Data_Ult_Recarga_Extintores,
        Data_Prox_Recarga_Extintores,
        Data_Limpeza_Caixa,
        Data_Prox_Limpeza,
        Cadeiras_Ruim,
        Cadeiras_Detalhe,
        Observacoes
    } = req.body;

    if (!Responsavel || !Data_Verificacao) {
        return res.status(400).json({
            mensagem: "Campos obrigatórios: Responsavel, Data_Verificacao"
        });
    }

    try {
        const query = `
            INSERT INTO Checklist (
                Responsavel,
                Data_Verificacao,
                Piso_ADM,
                Piso_Operacional,
                Piso_Galpao,
                Piso_Refeitorio,
                Forro_ADM,
                Forro_Operacional,
                Forro_Galpao,
                Forro_Refeitorio,
                Instalacoes_Eletricas,
                Protecao_Raios,
                ArCond_ADM,
                ArCond_Diretoria,
                ArCond_Reuniao,
                ArCond_Operacional,
                Lampadas_ADM,
                Lampadas_Diretoria,
                Lampadas_Reuniao,
                Lampadas_Operacional,
                Lampadas_Galpao,
                Lampadas_Refeitorio,
                Lampadas_BanheiroFem,
                Lampadas_BanheiroMasc,
                Macanetas_OK,
                Mesas_Protecao_OK,
                Condicoes_Paleteiras,
                Organizacao_Local,
                Cameras_OK,
                Balanca_Condicao,
                Data_Afericao_Balanca,
                Condicoes_Mictorios,
                Data_Limpeza_Bebedouro,
                Data_Prox_Dedetizacao,
                Data_Ult_Recarga_Extintores,
                Data_Prox_Recarga_Extintores,
                Data_Limpeza_Caixa,
                Data_Prox_Limpeza,
                Cadeiras_Ruim,
                Cadeiras_Detalhe,
                Observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            Responsavel,
            Data_Verificacao,
            Piso_ADM,
            Piso_Operacional,
            Piso_Galpao,
            Piso_Refeitorio,
            Forro_ADM,
            Forro_Operacional,
            Forro_Galpao,
            Forro_Refeitorio,
            Instalacoes_Eletricas,
            Protecao_Raios,
            ArCond_ADM,
            ArCond_Diretoria,
            ArCond_Reuniao,
            ArCond_Operacional,
            Lampadas_ADM,
            Lampadas_Diretoria,
            Lampadas_Reuniao,
            Lampadas_Operacional,
            Lampadas_Galpao,
            Lampadas_Refeitorio,
            Lampadas_BanheiroFem,
            Lampadas_BanheiroMasc,
            Macanetas_OK,
            Mesas_Protecao_OK,
            Condicoes_Paleteiras,
            Organizacao_Local,
            Cameras_OK,
            Balanca_Condicao,
            Data_Afericao_Balanca,
            Condicoes_Mictorios,
            Data_Limpeza_Bebedouro,
            Data_Prox_Dedetizacao,
            Data_Ult_Recarga_Extintores,
            Data_Prox_Recarga_Extintores,
            Data_Limpeza_Caixa,
            Data_Prox_Limpeza,
            Cadeiras_Ruim,
            Cadeiras_Detalhe,
            Observacoes
        ]);

        res.status(201).json({
            mensagem: "Checklist criado com sucesso!",
            idChecklist: result.insertId
        });

    } catch (error) {
        console.error("Erro ao criar checklist:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar checklist." });
    }
};

export const listarChecklists = async (req, res) => {
    try {
        const query = `
            SELECT * FROM Checklist
            ORDER BY Data_Verificacao DESC
        `;
        const [checklists] = await db.promise().query(query);
        res.status(200).json(checklists);
    } catch (error) {
        console.error("Erro ao listar checklists:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar checklists." });
    }
};

export const obterChecklistPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM Checklist WHERE ID_Checklist = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Checklist não encontrado." });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao obter checklist:", error);
        res.status(500).json({ mensagem: "Erro interno ao obter checklist." });
    }
};

export const excluirChecklist = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.promise().query(
            "DELETE FROM Checklist WHERE ID_Checklist = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Checklist não encontrado." });
        }

        res.status(200).json({ mensagem: "Checklist excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir checklist:", error);
        res.status(500).json({ mensagem: "Erro interno ao excluir checklist." });
    }
};
