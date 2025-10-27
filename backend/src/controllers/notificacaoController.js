import db from '../config/db.js';
import NotificacaoObserver from './notificacaoObserver.js';

export const criarNotificacaoPersonalizada = async (req, res) => {
    try {
        const { titulo, mensagem, destinatarios, prioridade, agendamento } = req.body;
        const criado_por = req.user?.id || 1; 

        if (!titulo || !mensagem || !destinatarios) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios: titulo, mensagem, destinatarios"
            });
        }

        let destinatariosValidados;
        if (destinatarios === 'todos') {
            destinatariosValidados = 'todos';
        } else if (Array.isArray(destinatarios)) {
            destinatariosValidados = destinatarios;
        } else if (typeof destinatarios === 'number') {
            destinatariosValidados = [destinatarios];
        } else {
            return res.status(400).json({
                mensagem: "Destinatários devem ser 'todos' ou um array de IDs"
            });
        }

        const resultado = await NotificacaoObserver.criarNotificacao({
            titulo,
            mensagem,
            destinatarios: destinatariosValidados,
            prioridade: prioridade || 'media',
            criado_por,
            agendamento: agendamento || null
        });

        if (resultado.success) {
            res.status(201).json({
                mensagem: "Notificação agendada com sucesso!",
                id: resultado.id
            });
        } else {
            res.status(500).json({
                mensagem: "Erro ao criar notificação",
                erro: resultado.error
            });
        }

    } catch (error) {
        console.error("❌ Erro ao criar notificação personalizada:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar notificação." });
    }
};

export const listarNotificacoes = async (req, res) => {
    try {
        const [tabelaExiste] = await db.promise().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'notificacoes_personalizadas'
        `);

        if (tabelaExiste.length === 0) {
            return res.status(200).json([]);
        }

        const query = `
            SELECT np.*, c.Nome_Col as criador_nome 
            FROM notificacoes_personalizadas np
            LEFT JOIN Colaboradores c ON np.criado_por = c.ID_colaborador
            ORDER BY np.criado_em DESC
            LIMIT 100
        `;

        const [notificacoes] = await db.promise().query(query);
        
        const notificacoesProcessadas = notificacoes.map(notificacao => {
            let destinatariosFormatados = 'Erro ao processar';
            
            try {
                if (notificacao.destinatarios === 'todos' || notificacao.destinatarios === '"todos"') {
                    destinatariosFormatados = 'Todos os colaboradores';
                } else {
                    const destinatariosArray = JSON.parse(notificacao.destinatarios);
                    if (Array.isArray(destinatariosArray)) {
                        destinatariosFormatados = `${destinatariosArray.length} colaborador(es)`;
                    } else {
                        destinatariosFormatados = 'Destinatário específico';
                    }
                }
            } catch (error) {
                console.error('Erro ao processar destinatários:', error);
            }

            return {
                ...notificacao,
                destinatarios_formatados: destinatariosFormatados
            };
        });

        res.status(200).json(notificacoesProcessadas);

    } catch (error) {
        console.error(" Erro ao listar notificações:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar notificações." });
    }
};

export const notificacaoRapida = async (req, res) => {
    try {
        const { titulo, mensagem, destinatarioId } = req.body;
        const criado_por = req.user?.id || 1;

        if (!titulo || !mensagem || !destinatarioId) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios: titulo, mensagem, destinatarioId"
            });
        }

        const resultado = await NotificacaoObserver.notificacaoRapida(
            titulo,
            mensagem,
            destinatarioId,
            criado_por
        );

        if (resultado.success) {
            res.status(201).json({ 
                mensagem: "Notificação enviada com sucesso!",
                id: resultado.id
            });
        } else {
            res.status(500).json({ 
                mensagem: "Erro ao enviar notificação",
                erro: resultado.error
            });
        }

    } catch (error) {
        console.error(" Erro ao enviar notificação rápida:", error);
        res.status(500).json({ mensagem: "Erro interno ao enviar notificação." });
    }
};

export const notificarTodos = async (req, res) => {
    try {
        const { titulo, mensagem, prioridade } = req.body;
        const criado_por = req.user?.id || 1;

        if (!titulo || !mensagem) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios: titulo, mensagem"
            });
        }

        const resultado = await NotificacaoObserver.notificarTodos(
            titulo,
            mensagem,
            criado_por,
            prioridade
        );

        if (resultado.success) {
            res.status(201).json({ 
                mensagem: "Notificação para todos enviada com sucesso!",
                id: resultado.id
            });
        } else {
            res.status(500).json({ 
                mensagem: "Erro ao enviar notificação",
                erro: resultado.error
            });
        }

    } catch (error) {
        console.error(" Erro ao notificar todos:", error);
        res.status(500).json({ mensagem: "Erro interno ao enviar notificação." });
    }
};

export const obterNotificacaoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT np.*, c.Nome_Col as criador_nome 
            FROM notificacoes_personalizadas np
            LEFT JOIN Colaboradores c ON np.criado_por = c.ID_colaborador
            WHERE np.id = ?
        `;

        const [notificacoes] = await db.promise().query(query, [id]);

        if (notificacoes.length === 0) {
            return res.status(404).json({ mensagem: "Notificação não encontrada." });
        }

        res.status(200).json(notificacoes[0]);

    } catch (error) {
        console.error(" Erro ao buscar notificação:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar notificação." });
    }
};

export const obterDestinatariosDisponiveis = async (req, res) => {
    try {
        const query = `
            SELECT ID_colaborador, Nome_Col, Email, Setor 
            FROM Colaboradores 
            WHERE Email IS NOT NULL AND Email != ''
            ORDER BY Nome_Col ASC
        `;

        const [colaboradores] = await db.promise().query(query);

        res.status(200).json(colaboradores);

    } catch (error) {
        console.error(" Erro ao buscar destinatários:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar destinatários." });
    }
};