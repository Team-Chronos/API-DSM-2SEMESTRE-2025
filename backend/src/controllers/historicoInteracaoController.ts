import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from '../config/db.js';

export interface InteracaoCliente {
    ID_Cliente: number;
    ID_Colaborador: number;
    Data_Interacao?: string;
    Tipo_Interacao: 'Ligação' | 'Email' | 'Reunião' | 'Mensagem' | 'Outro';
    Descricao: string;
    Resultado?: string;
}

export const registrarInteracao = async (req: Request, res: Response) => {
    const { ID_Cliente, ID_Colaborador, Data_Interacao, Tipo_Interacao, Descricao, Resultado }: InteracaoCliente = req.body;

    if (!ID_Cliente || !ID_Colaborador || !Tipo_Interacao || !Descricao) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: ID_Cliente, ID_Colaborador, Tipo_Interacao, Descricao" 
        });
    }

    try {
        const query = `
            INSERT INTO Historico_Interacao (
                ID_Cliente,
                ID_Colaborador,
                Data_Interacao,
                Tipo_Interacao,
                Descricao,
                Resultado
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const params = [
            ID_Cliente,
            ID_Colaborador,
            Data_Interacao || new Date().toISOString().slice(0, 19).replace('T', ' '),
            Tipo_Interacao,
            Descricao,
            Resultado || null
        ];

        const [result] = await db.promise().query(query, params) as [ResultSetHeader, any];

        res.status(201).json({ 
            mensagem: "Interação registrada com sucesso!", 
            idInteracao: result.insertId 
        });

    } catch (error) {
        console.error("Erro ao registrar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao registrar interação." });
    }
};

export const listarInteracoesPorCliente = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                hi.*,
                c.Nome_Col as Nome_Vendedor,
                cl.Nome_Cliente,
                cl.Email_Cliente,
                cl.Telefone_Cliente
            FROM Historico_Interacao hi
            INNER JOIN Colaboradores c ON hi.ID_Colaborador = c.ID_colaborador
            INNER JOIN Cliente cl ON hi.ID_Cliente = cl.ID_Cliente
            WHERE hi.ID_Cliente = ?
            ORDER BY hi.Data_Interacao DESC
        `;

        const [interacoes] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        res.status(200).json(interacoes);

    } catch (error) {
        console.error("Erro ao listar interações:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar interações." });
    }
};

export const listarInteracoesPorVendedor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                hi.*,
                cl.Nome_Cliente,
                cl.Email_Cliente,
                cl.Telefone_Cliente,
                cl.Endereco
            FROM Historico_Interacao hi
            INNER JOIN Cliente cl ON hi.ID_Cliente = cl.ID_Cliente
            WHERE hi.ID_Colaborador = ?
            ORDER BY hi.Data_Interacao DESC
        `;

        const [interacoes] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        res.status(200).json(interacoes);

    } catch (error) {
        console.error("Erro ao listar interações do vendedor:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar interações." });
    }
};

export const obterInteracaoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                hi.*,
                c.Nome_Col as Nome_Vendedor,
                cl.Nome_Cliente,
                cl.Email_Cliente,
                cl.Telefone_Cliente
            FROM Historico_Interacao hi
            INNER JOIN Colaboradores c ON hi.ID_Colaborador = c.ID_colaborador
            INNER JOIN Cliente cl ON hi.ID_Cliente = cl.ID_Cliente
            WHERE hi.ID_Interacao = ?
        `;

        const [interacoes] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        if (interacoes.length === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json(interacoes[0]);

    } catch (error) {
        console.error("Erro ao buscar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar interação." });
    }
};

export const atualizarInteracao = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Tipo_Interacao, Descricao, Resultado }: Partial<InteracaoCliente> = req.body;

    if (!Tipo_Interacao || !Descricao) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: Tipo_Interacao, Descricao" 
        });
    }

    try {
        const query = `
            UPDATE Historico_Interacao 
            SET Tipo_Interacao = ?, Descricao = ?, Resultado = ?
            WHERE ID_Interacao = ?
        `;

        const [result] = await db.promise().query(query, [Tipo_Interacao, Descricao, Resultado, id]) as [ResultSetHeader, any];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json({ mensagem: "Interação atualizada com sucesso!" });

    } catch (error) {
        console.error("Erro ao atualizar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar interação." });
    }
};

export const excluirInteracao = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM Historico_Interacao WHERE ID_Interacao = ?";
        const [result] = await db.promise().query(query, [id]) as [ResultSetHeader, any];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json({ mensagem: "Interação excluída com sucesso!" });

    } catch (error) {
        console.error("Erro ao excluir interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao excluir interação." });
    }
};