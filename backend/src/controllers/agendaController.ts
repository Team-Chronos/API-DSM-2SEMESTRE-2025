import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from '../config/db.js';
import transporter from '../mailer.js';

export interface TarefaAgenda {
    ID_Colaborador: number;
    Titulo: string;
    Descricao: string;
    Data_Hora_Inicio: string;
    Data_Hora_Fim?: string;
    Local_Evento?: string;
    ID_Cliente?: number;
    Tipo_Contato: 'Ligação' | 'Email' | 'Reunião' | 'Visita' | 'Follow-up';
    Prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
}

export const criarTarefa = async (req: Request, res: Response) => {
    const { 
        ID_Colaborador, 
        Titulo, 
        Descricao, 
        Data_Hora_Inicio, 
        Data_Hora_Fim, 
        Local_Evento, 
        ID_Cliente,
        Tipo_Contato,
        Prioridade 
    }: TarefaAgenda = req.body;

    if (!ID_Colaborador || !Titulo || !Data_Hora_Inicio || !Tipo_Contato) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: ID_Colaborador, Titulo, Data_Hora_Inicio, Tipo_Contato" 
        });
    }

    try {
        const query = `
            INSERT INTO Agenda (
                ID_Colaborador,
                Titulo,
                Descricao,
                Data_Hora_Inicio,
                Data_Hora_Fim,
                Local_Evento,
                Status
            ) VALUES (?, ?, ?, ?, ?, ?, 'Pendente')
        `;

        const [result] = await db.promise().query(query, [
            ID_Colaborador,
            Titulo,
            Descricao,
            Data_Hora_Inicio,
            Data_Hora_Fim || null,
            Local_Evento || null
        ]) as [ResultSetHeader, any];

        if (ID_Cliente) {
            const queryInteracao = `
                INSERT INTO Historico_Interacao (
                    ID_Cliente,
                    ID_Colaborador,
                    Data_Interacao,
                    Tipo_Interacao,
                    Descricao,
                    Resultado
                ) VALUES (?, ?, ?, ?, ?, 'Agendado')
            `;

            await db.promise().query(queryInteracao, [
                ID_Cliente,
                ID_Colaborador,
                Data_Hora_Inicio,
                Tipo_Contato,
                `[AGENDADO] ${Descricao} - Prioridade: ${Prioridade}`
            ]);
        }

        res.status(201).json({ 
            mensagem: "Tarefa agendada com sucesso!", 
            idTarefa: result.insertId 
        });

    } catch (error) {
        console.error("Erro ao agendar tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao agendar tarefa." });
    }
};

export const listarTarefasVendedor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.*,
                c.Nome_Cliente,
                c.Telefone_Cliente,
                c.Email_Cliente
            FROM Agenda a
            LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
            WHERE a.ID_Colaborador = ?
            ORDER BY a.Data_Hora_Inicio ASC
        `;

        const [tarefas] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        res.status(200).json(tarefas);

    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
    }
};

export const listarTarefasProximas = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.*,
                c.Nome_Cliente,
                c.Telefone_Cliente
            FROM Agenda a
            LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
            WHERE a.ID_Colaborador = ? 
            AND a.Status = 'Pendente'
            AND a.Data_Hora_Inicio BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
            ORDER BY a.Data_Hora_Inicio ASC
        `;

        const [tarefas] = await db.promise().query(query, [id]) as [RowDataPacket[], any];

        res.status(200).json({
            totalProximas: tarefas.length,
            tarefas: tarefas
        });

    } catch (error) {
        console.error("Erro ao listar tarefas próximas:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
    }
};

export const atualizarStatusTarefa = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Status } = req.body;

    if (!Status || !['Pendente', 'Em andamento', 'Concluído', 'Cancelado'].includes(Status)) {
        return res.status(400).json({ 
            mensagem: "Status inválido. Use: Pendente, Em andamento, Concluído ou Cancelado" 
        });
    }

    try {
        const query = "UPDATE Agenda SET Status = ? WHERE ID_Agenda = ?";
        const [result] = await db.promise().query(query, [Status, id]) as [ResultSetHeader, any];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.status(200).json({ mensagem: `Tarefa marcada como ${Status}!` });

    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar tarefa." });
    }
};