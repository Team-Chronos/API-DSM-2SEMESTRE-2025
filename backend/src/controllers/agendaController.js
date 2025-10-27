import db from '../config/db.js';

export const criarTarefa = async (req, res) => {
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
    } = req.body;

    if (!ID_Colaborador || !Titulo || !Data_Hora_Inicio) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: ID_Colaborador, Titulo, Data_Hora_Inicio" 
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
                Status,
                Prioridade,
                ID_Cliente,
                Tipo_Contato
            ) VALUES (?, ?, ?, ?, ?, ?, 'Pendente', ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            ID_Colaborador,
            Titulo,
            Descricao,
            Data_Hora_Inicio,
            Data_Hora_Fim || null,
            Local_Evento || null,
            Prioridade || 'Média',
            ID_Cliente || null,
            Tipo_Contato || 'Reunião'
        ]);

        // Se houver cliente, registrar no histórico
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
                Tipo_Contato || 'Reunião',
                `[AGENDADO] ${Titulo} - ${Descricao} - Prioridade: ${Prioridade || 'Média'}`
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

export const listarTarefasVendedor = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.*,
                c.Nome_Cliente,
                c.Telefone_Cliente,
                c.Email_Cliente,
                col.Nome_Col
            FROM Agenda a
            LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
            LEFT JOIN Colaboradores col ON a.ID_Colaborador = col.ID_colaborador
            WHERE a.ID_Colaborador = ?
            ORDER BY a.Data_Hora_Inicio ASC
        `;

        const [tarefas] = await db.promise().query(query, [id]);

        res.status(200).json(tarefas);

    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
    }
};

export const listarTarefasProximas = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.*,
                c.Nome_Cliente,
                c.Telefone_Cliente,
                col.Nome_Col
            FROM Agenda a
            LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
            LEFT JOIN Colaboradores col ON a.ID_Colaborador = col.ID_colaborador
            WHERE a.ID_Colaborador = ? 
            AND a.Status = 'Pendente'
            AND a.Data_Hora_Inicio BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
            ORDER BY a.Data_Hora_Inicio ASC
        `;

        const [tarefas] = await db.promise().query(query, [id]);

        res.status(200).json({
            totalProximas: tarefas.length,
            tarefas: tarefas
        });

    } catch (error) {
        console.error("Erro ao listar tarefas próximas:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
    }
};

export const atualizarStatusTarefa = async (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    if (!Status || !['Pendente', 'Em andamento', 'Concluído', 'Cancelado'].includes(Status)) {
        return res.status(400).json({ 
            mensagem: "Status inválido. Use: Pendente, Em andamento, Concluído ou Cancelado" 
        });
    }

    try {
        const query = "UPDATE Agenda SET Status = ? WHERE ID_Agenda = ?";
        const [result] = await db.promise().query(query, [Status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.status(200).json({ mensagem: `Tarefa marcada como ${Status}!` });

    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar tarefa." });
    }
};

export const obterTarefaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.*,
                c.Nome_Cliente,
                c.Telefone_Cliente,
                c.Email_Cliente,
                col.Nome_Col
            FROM Agenda a
            LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
            LEFT JOIN Colaboradores col ON a.ID_Colaborador = col.ID_colaborador
            WHERE a.ID_Agenda = ?
        `;

        const [tarefas] = await db.promise().query(query, [id]);

        if (tarefas.length === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.status(200).json(tarefas[0]);

    } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar tarefa." });
    }
};

export const atualizarTarefa = async (req, res) => {
    const { id } = req.params;
    const { 
        Titulo, 
        Descricao, 
        Data_Hora_Inicio, 
        Data_Hora_Fim, 
        Local_Evento,
        Prioridade,
        ID_Cliente,
        Tipo_Contato
    } = req.body;

    try {
        const query = `
            UPDATE Agenda 
            SET Titulo = ?, Descricao = ?, Data_Hora_Inicio = ?, 
                Data_Hora_Fim = ?, Local_Evento = ?, Prioridade = ?,
                ID_Cliente = ?, Tipo_Contato = ?
            WHERE ID_Agenda = ?
        `;

        const [result] = await db.promise().query(query, [
            Titulo,
            Descricao,
            Data_Hora_Inicio,
            Data_Hora_Fim || null,
            Local_Evento || null,
            Prioridade || 'Média',
            ID_Cliente || null,
            Tipo_Contato || 'Reunião',
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.status(200).json({ mensagem: "Tarefa atualizada com sucesso!" });

    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar tarefa." });
    }
};

export const excluirTarefa = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM Agenda WHERE ID_Agenda = ?";
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.status(200).json({ mensagem: "Tarefa excluída com sucesso!" });

    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        res.status(500).json({ mensagem: "Erro interno ao excluir tarefa." });
    }
};

// Novos métodos para clientes
export const criarCliente = async (req, res) => {
    const { 
        Nome_Cliente, 
        Telefone_Cliente, 
        Email_Cliente,
        Criado_Por 
    } = req.body;

    if (!Nome_Cliente || !Criado_Por) {
        return res.status(400).json({ 
            mensagem: "Campos obrigatórios: Nome_Cliente, Criado_Por" 
        });
    }

    try {
        const query = `
            INSERT INTO Cliente (
                Nome_Cliente,
                Telefone_Cliente,
                Email_Cliente,
                Criado_Por
            ) VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            Nome_Cliente,
            Telefone_Cliente || null,
            Email_Cliente || null,
            Criado_Por
        ]);

        res.status(201).json({ 
            mensagem: "Cliente cadastrado com sucesso!", 
            idCliente: result.insertId 
        });

    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar cliente." });
    }
};

export const listarClientes = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*,
                col.Nome_Col as Nome_Criador
            FROM Cliente c
            LEFT JOIN Colaboradores col ON c.Criado_Por = col.ID_colaborador
            ORDER BY c.Nome_Cliente ASC
        `;

        const [clientes] = await db.promise().query(query);

        res.status(200).json(clientes);

    } catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar clientes." });
    }
};