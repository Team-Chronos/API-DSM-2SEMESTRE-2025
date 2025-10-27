import db from '../config/db.js';

export const registrarInteracao = async (req, res) => {
    try {
        const {
            id_cliente,
            id_vendedor,
            data_interacao,
            forma_contato,
            titulo,
            descricao,
            resultado,
            proxima_acao,
            data_proxima_acao,
            prioridade
        } = req.body;

        if (!id_cliente || !id_vendedor || !data_interacao || !forma_contato || !titulo) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios: id_cliente, id_vendedor, data_interacao, forma_contato, titulo"
            });
        }

        const query = `
            INSERT INTO Historico_Interacao (
                ID_Cliente,
                ID_Colaborador,
                Data_Interacao,
                Forma_Contato,
                Titulo,
                Descricao,
                Resultado,
                Proxima_Acao,
                Data_Proxima_Acao,
                Prioridade,
                Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Realizada')
        `;

        const [result] = await db.promise().query(query, [
            id_cliente,
            id_vendedor,
            data_interacao,
            forma_contato,
            titulo,
            descricao || null,
            resultado || null,
            proxima_acao || null,
            data_proxima_acao || null,
            prioridade || 'Media'
        ]);

        await db.promise().query(`
            UPDATE Cliente 
            SET Ultima_Interacao = ? 
            WHERE ID_Cliente = ?
        `, [data_interacao, id_cliente]);

        res.status(201).json({
            mensagem: "Interação registrada com sucesso!",
            id_interacao: result.insertId
        });

    } catch (error) {
        console.error(" Erro ao registrar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao registrar interação." });
    }
};

export const listarInteracoesCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;

        const query = `
            SELECT 
                hi.*,
                c.Nome_Col as vendedor_nome,
                cli.Nome_Cliente,
                cli.Telefone_Cliente,
                cli.Email_Cliente
            FROM Historico_Interacao hi
            INNER JOIN Colaboradores c ON hi.ID_Colaborador = c.ID_colaborador
            INNER JOIN Cliente cli ON hi.ID_Cliente = cli.ID_Cliente
            WHERE hi.ID_Cliente = ?
            ORDER BY hi.Data_Interacao DESC
        `;

        const [interacoes] = await db.promise().query(query, [id_cliente]);

        res.status(200).json(interacoes);

    } catch (error) {
        console.error(" Erro ao listar interações:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar interações." });
    }
};

export const listarInteracoesVendedor = async (req, res) => {
    try {
        const { id_vendedor } = req.params;
        const { data_inicio, data_fim, forma_contato, status } = req.query;

        let query = `
            SELECT 
                hi.*,
                cli.Nome_Cliente,
                cli.Telefone_Cliente,
                cli.Email_Cliente,
                cli.Segmento
            FROM Historico_Interacao hi
            INNER JOIN Cliente cli ON hi.ID_Cliente = cli.ID_Cliente
            WHERE hi.ID_Colaborador = ?
        `;

        const params = [id_vendedor];

        if (data_inicio && data_fim) {
            query += ` AND hi.Data_Interacao BETWEEN ? AND ?`;
            params.push(data_inicio, data_fim);
        }

        if (forma_contato) {
            query += ` AND hi.Forma_Contato = ?`;
            params.push(forma_contato);
        }

        if (status) {
            query += ` AND hi.Status = ?`;
            params.push(status);
        }

        query += ` ORDER BY hi.Data_Interacao DESC`;

        const [interacoes] = await db.promise().query(query, params);

        res.status(200).json(interacoes);

    } catch (error) {
        console.error(" Erro ao listar interações do vendedor:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar interações." });
    }
};

export const obterInteracaoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                hi.*,
                c.Nome_Col as vendedor_nome,
                cli.Nome_Cliente,
                cli.Telefone_Cliente,
                cli.Email_Cliente,
                cli.Segmento
            FROM Historico_Interacao hi
            INNER JOIN Colaboradores c ON hi.ID_Colaborador = c.ID_colaborador
            INNER JOIN Cliente cli ON hi.ID_Cliente = cli.ID_Cliente
            WHERE hi.ID_Interacao = ?
        `;

        const [interacoes] = await db.promise().query(query, [id]);

        if (interacoes.length === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json(interacoes[0]);

    } catch (error) {
        console.error(" Erro ao buscar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar interação." });
    }
};

export const atualizarInteracao = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            data_interacao,
            forma_contato,
            titulo,
            descricao,
            resultado,
            proxima_acao,
            data_proxima_acao,
            prioridade,
            status
        } = req.body;

        const query = `
            UPDATE Historico_Interacao 
            SET Data_Interacao = ?,
                Forma_Contato = ?,
                Titulo = ?,
                Descricao = ?,
                Resultado = ?,
                Proxima_Acao = ?,
                Data_Proxima_Acão = ?,
                Prioridade = ?,
                Status = ?,
                Atualizado_Em = NOW()
            WHERE ID_Interacao = ?
        `;

        const [result] = await db.promise().query(query, [
            data_interacao,
            forma_contato,
            titulo,
            descricao,
            resultado,
            proxima_acao,
            data_proxima_acao,
            prioridade,
            status,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json({ mensagem: "Interação atualizada com sucesso!" });

    } catch (error) {
        console.error(" Erro ao atualizar interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar interação." });
    }
};

export const excluirInteracao = async (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM Historico_Interacao WHERE ID_Interacao = ?";
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Interação não encontrada." });
        }

        res.status(200).json({ mensagem: "Interação excluída com sucesso!" });

    } catch (error) {
        console.error(" Erro ao excluir interação:", error);
        res.status(500).json({ mensagem: "Erro interno ao excluir interação." });
    }
};

export const obterProximasAcoes = async (req, res) => {
    try {
        const { id_vendedor } = req.params;

        const query = `
            SELECT 
                hi.*,
                cli.Nome_Cliente,
                cli.Telefone_Cliente,
                cli.Email_Cliente
            FROM Historico_Interacao hi
            INNER JOIN Cliente cli ON hi.ID_Cliente = cli.ID_Cliente
            WHERE hi.ID_Colaborador = ?
                AND hi.Data_Proxima_Acao IS NOT NULL
                AND hi.Data_Proxima_Acao >= CURDATE()
                AND hi.Status != 'Concluída'
            ORDER BY hi.Data_Proxima_Acao ASC
            LIMIT 20
        `;

        const [proximasAcoes] = await db.promise().query(query, [id_vendedor]);

        res.status(200).json(proximasAcoes);

    } catch (error) {
        console.error(" Erro ao buscar próximas ações:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar próximas ações." });
    }
};

export const obterEstatisticasVendedor = async (req, res) => {
    try {
        const { id_vendedor } = req.params;
        const { mes, ano } = req.query;

        const dataFiltro = mes && ano ? `${ano}-${mes.padStart(2, '0')}` : null;

        let queryWhere = "WHERE hi.ID_Colaborador = ?";
        const params = [id_vendedor];

        if (dataFiltro) {
            queryWhere += " AND DATE_FORMAT(hi.Data_Interacao, '%Y-%m') = ?";
            params.push(dataFiltro);
        }

        const [estatisticas] = await db.promise().query(`
            SELECT 
                COUNT(*) as total_interacoes,
                COUNT(DISTINCT hi.ID_Cliente) as clientes_ativos,
                SUM(CASE WHEN hi.Resultado = 'Venda Realizada' THEN 1 ELSE 0 END) as vendas_realizadas,
                SUM(CASE WHEN hi.Forma_Contato = 'Telefone' THEN 1 ELSE 0 END) as contatos_telefone,
                SUM(CASE WHEN hi.Forma_Contato = 'Email' THEN 1 ELSE 0 END) as contatos_email,
                SUM(CASE WHEN hi.Forma_Contato = 'Reunião' THEN 1 ELSE 0 END) as reunioes,
                SUM(CASE WHEN hi.Forma_Contato = 'Visita' THEN 1 ELSE 0 END) as visitas
            FROM Historico_Interacao hi
            ${queryWhere}
        `, params);

        const [contatosPorForma] = await db.promise().query(`
            SELECT 
                Forma_Contato,
                COUNT(*) as total
            FROM Historico_Interacao hi
            ${queryWhere}
            GROUP BY Forma_Contato
            ORDER BY total DESC
        `, params);

        res.status(200).json({
            estatisticas_gerais: estatisticas[0],
            contatos_por_forma: contatosPorForma
        });

    } catch (error) {
        console.error(" Erro ao buscar estatísticas:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar estatísticas." });
    }
};
