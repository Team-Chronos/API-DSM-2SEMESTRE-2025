import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from '../config/db.js';

export interface Cliente {
    Nome_Cliente: string;
    Email_Cliente: string;
    Telefone_Cliente?: string;
    CPF_CNPJ?: string;
    Endereco?: string;
}

export const criarCliente = async (req: Request, res: Response) => {
    const { Nome_Cliente, Email_Cliente, Telefone_Cliente, CPF_CNPJ, Endereco }: Cliente = req.body;

    if (!Nome_Cliente || !Email_Cliente) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: Nome_Cliente, Email_Cliente" 
        });
    }

    try {
        const query = `
            INSERT INTO Cliente (
                Nome_Cliente,
                Email_Cliente,
                Telefone_Cliente,
                CPF_CNPJ,
                Endereco
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            Nome_Cliente,
            Email_Cliente,
            Telefone_Cliente || null,
            CPF_CNPJ || null,
            Endereco || null
        ]) as [ResultSetHeader, any];

        res.status(201).json({ 
            mensagem: "Cliente cadastrado com sucesso!", 
            idCliente: result.insertId 
        });

    } catch (error: any) {
        console.error("Erro ao cadastrar cliente:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                mensagem: "Email ou CPF/CNPJ já cadastrado no sistema." 
            });
        }
        
        res.status(500).json({ mensagem: "Erro interno ao cadastrar cliente." });
    }
};

export const listarClientes = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                c.*,
                COUNT(hi.ID_Interacao) as Total_Interacoes,
                MAX(hi.Data_Interacao) as Ultima_Interacao
            FROM Cliente c
            LEFT JOIN Historico_Interacao hi ON c.ID_Cliente = hi.ID_Cliente
            GROUP BY c.ID_Cliente
            ORDER BY c.Nome_Cliente
        `;

        const [clientes] = await db.promise().query(query) as [RowDataPacket[], any];

        res.status(200).json(clientes);

    } catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar clientes." });
    }
};

export const obterClientePorId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = "SELECT * FROM Cliente WHERE ID_Cliente = ?";
        const [clientes] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        if (clientes.length === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        res.status(200).json(clientes[0]);

    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar cliente." });
    }
};

export const atualizarCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Nome_Cliente, Email_Cliente, Telefone_Cliente, CPF_CNPJ, Endereco }: Partial<Cliente> = req.body;

    if (!Nome_Cliente || !Email_Cliente) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: Nome_Cliente, Email_Cliente" 
        });
    }

    try {
        const query = `
            UPDATE Cliente 
            SET Nome_Cliente = ?, Email_Cliente = ?, Telefone_Cliente = ?, CPF_CNPJ = ?, Endereco = ?
            WHERE ID_Cliente = ?
        `;

        const [result] = await db.promise().query(query, [
            Nome_Cliente,
            Email_Cliente,
            Telefone_Cliente || null,
            CPF_CNPJ || null,
            Endereco || null,
            id
        ]) as [ResultSetHeader, any];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

    } catch (error: any) {
        console.error("Erro ao atualizar cliente:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                mensagem: "Email ou CPF/CNPJ já cadastrado no sistema." 
            });
        }
        
        res.status(500).json({ mensagem: "Erro interno ao atualizar cliente." });
    }
};