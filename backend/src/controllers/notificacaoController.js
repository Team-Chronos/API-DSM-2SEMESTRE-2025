import db from '../config/db.js';
import NotificacaoObserver from '../observers/notificacaoObserver.js';
import notificacaoObserver from '../observers/notificacaoObserver.js';

export const criarNotificacaoPersonalizada = async (req, res) => {
  try {
    const { titulo, mensagem, destinatarios, prioridade, agendamento } =
      req.body;
    const criado_por = req.user?.id || 1;

    if (!titulo || !mensagem || !destinatarios) {
      return res.status(400).json({
        mensagem: "Campos obrigatórios: titulo, mensagem, destinatarios",
      });
    }

    let destinatariosValidados;
    if (destinatarios === "todos") {
      destinatariosValidados = "todos";
    } else if (Array.isArray(destinatarios)) {
      destinatariosValidados = destinatarios;
    } else if (typeof destinatarios === "number") {
      destinatariosValidados = [destinatarios];
    } else {
      return res.status(400).json({
        mensagem: "Destinatários devem ser 'todos' ou um array de IDs",
      });
    }

    const resultado = await NotificacaoObserver.criarNotificacao({
      titulo,
      mensagem,
      destinatarios: destinatariosValidados,
      prioridade: prioridade || "media",
      criado_por,
      agendamento: agendamento || null,
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
    console.error("Erro ao criar notificação personalizada:", error);
    res.status(500).json({ mensagem: "Erro interno ao criar notificação." });
  }
};

export const listarNotificacoes = async (req, res) => {
  try {
    // ✅ CORREÇÃO: Verificar se a tabela existe de forma mais segura
    try {
      await db.promise().query('SELECT 1 FROM notificacoes_personalizadas LIMIT 1');
    } catch (error) {
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
      let destinatariosFormatados = 'Destinatário específico';

      try {
        if (!notificacao.destinatarios) {
          destinatariosFormatados = 'Nenhum destinatário';
        } else if (typeof notificacao.destinatarios === 'string') {
          if (notificacao.destinatarios.includes('todos') || notificacao.destinatarios === '"todos"') {
            destinatariosFormatados = 'Todos os colaboradores';
          } else {
            try {
              const parsed = JSON.parse(notificacao.destinatarios);
              if (Array.isArray(parsed)) {
                destinatariosFormatados = `${parsed.length} colaborador(es)`;
              } else if (parsed === 'todos') {
                destinatariosFormatados = 'Todos os colaboradores';
              }
            } catch {
              destinatariosFormatados = 'Destinatário específico';
            }
          }
        } else if (Array.isArray(notificacao.destinatarios)) {
          destinatariosFormatados = `${notificacao.destinatarios.length} colaborador(es)`;
        }
      } catch (error) {
        console.error('Erro ao processar destinatários:', error);
        destinatariosFormatados = 'Erro ao processar';
      }

      return {
        ...notificacao,
        destinatarios_formatados: destinatariosFormatados,
      };
    });

    res.status(200).json(notificacoesProcessadas);

  } catch (error) {
    console.error("Erro ao listar notificações:", error);
    res.status(500).json({ mensagem: "Erro interno ao listar notificações." });
  }
};

export const notificacaoRapida = async (req, res) => {
  try {
    const { titulo, mensagem, destinatarioId } = req.body;
    const criado_por = req.user?.id || 1;

    if (!titulo || !mensagem || !destinatarioId) {
      return res.status(400).json({
        mensagem: "Campos obrigatórios: titulo, mensagem, destinatarioId",
      });
    }

    // ✅ CORREÇÃO: Validar se o destinatário existe
    try {
      const [destinatarioExiste] = await db.promise().query(
        'SELECT ID_colaborador FROM Colaboradores WHERE ID_colaborador = ?',
        [destinatarioId]
      );

      if (destinatarioExiste.length === 0) {
        return res.status(400).json({
          mensagem: "Destinatário não encontrado"
        });
      }
    } catch (error) {
      console.error("Erro ao validar destinatário:", error);
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
    console.error("Erro ao enviar notificação rápida:", error);
    res.status(500).json({ mensagem: "Erro interno ao enviar notificação." });
  }
};

export const notificarTodos = async (req, res) => {
  try {
    const { titulo, mensagem, prioridade } = req.body;
    const criado_por = req.user?.id || 1;

    if (!titulo || !mensagem) {
      return res.status(400).json({
        mensagem: "Campos obrigatórios: titulo, mensagem",
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
    console.error("Erro ao notificar todos:", error);
    res.status(500).json({ mensagem: "Erro interno ao enviar notificação." });
  }
};

export const obterNotificacaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CORREÇÃO: Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const query = `
      SELECT np.*, c.Nome_Col as criador_nome 
      FROM notificacoes_personalizadas np
      LEFT JOIN Colaboradores c ON np.criado_por = c.ID_colaborador
      WHERE np.id = ?
    `;

    const [notificacoes] = await db.promise().query(query, [parseInt(id)]);

    if (notificacoes.length === 0) {
      return res.status(404).json({ mensagem: "Notificação não encontrada." });
    }

    res.status(200).json(notificacoes[0]);

  } catch (error) {
    console.error("Erro ao buscar notificação:", error);
    res.status(500).json({ mensagem: "Erro interno ao buscar notificação." });
  }
};

export const obterDestinatariosDisponiveis = async (req, res) => {
  try {
    // ✅ CORREÇÃO: Melhor validação de email
    const query = `
      SELECT ID_colaborador, Nome_Col, Email, Setor 
      FROM Colaboradores 
      WHERE Email IS NOT NULL AND Email != '' AND Email LIKE '%@%.%'
      ORDER BY Nome_Col ASC
    `;

    const [colaboradores] = await db.promise().query(query);

    res.status(200).json(colaboradores);

  } catch (error) {
    console.error("Erro ao buscar destinatários:", error);
    res.status(500).json({ mensagem: "Erro interno ao buscar destinatários." });
  }
};

export const obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await notificacaoObserver.obterEstatisticas();

    if (estatisticas) {
      res.status(200).json(estatisticas);
    } else {
      res.status(500).json({ mensagem: "Erro ao obter estatísticas" });
    }

  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({ mensagem: "Erro interno ao obter estatísticas." });
  }
};

export const cancelarNotificacao = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CORREÇÃO: Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const query = 'UPDATE notificacoes_personalizadas SET status = "cancelada" WHERE id = ? AND status = "pendente"';
    const [result] = await db.promise().query(query, [parseInt(id)]);

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: "Notificação cancelada com sucesso!" });
    } else {
      res.status(400).json({ mensagem: "Notificação não encontrada ou já processada" });
    }

  } catch (error) {
    console.error("Erro ao cancelar notificação:", error);
    res.status(500).json({ mensagem: "Erro interno ao cancelar notificação." });
  }
};

export const reenviarNotificacao = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CORREÇÃO: Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const query = 'UPDATE notificacoes_personalizadas SET status = "pendente", enviado_em = NULL WHERE id = ? AND status IN ("erro", "cancelada")';
    const [result] = await db.promise().query(query, [parseInt(id)]);

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: "Notificação será reenviada em breve!" });
    } else {
      res.status(400).json({ mensagem: "Notificação não encontrada ou não pode ser reenviada" });
    }

  } catch (error) {
    console.error("Erro ao reenviar notificação:", error);
    res.status(500).json({ mensagem: "Erro interno ao reenviar notificação." });
  }
};

export const dashboardNotificacoes = async (req, res) => {
  try {
    // ✅ CORREÇÃO: Verificar se a tabela existe primeiro
    try {
      await db.promise().query('SELECT 1 FROM notificacoes_personalizadas LIMIT 1');
    } catch (error) {
      return res.status(200).json({
        estatisticas: {
          totalNotificacoes: 0,
          pendentes: 0,
          enviadas: 0,
          totalColaboradores: 0
        },
        ultimasNotificacoes: [],
        porStatus: [],
        porPrioridade: []
      });
    }

    const [ultimasNotificacoes] = await db.promise().query(`
      SELECT np.*, c.Nome_Col as criador_nome 
      FROM notificacoes_personalizadas np
      LEFT JOIN Colaboradores c ON np.criado_por = c.ID_colaborador
      ORDER BY np.criado_em DESC 
      LIMIT 10
    `);

    const estatisticas = await notificacaoObserver.obterEstatisticas();

    const [notificacoesPorStatus] = await db.promise().query(`
      SELECT status, COUNT(*) as quantidade 
      FROM notificacoes_personalizadas 
      GROUP BY status
    `);

    const [notificacoesPorPrioridade] = await db.promise().query(`
      SELECT prioridade, COUNT(*) as quantidade 
      FROM notificacoes_personalizadas 
      GROUP BY prioridade
    `);

    res.status(200).json({
      estatisticas: estatisticas || {
        totalNotificacoes: 0,
        pendentes: 0,
        enviadas: 0,
        totalColaboradores: 0
      },
      ultimasNotificacoes,
      porStatus: notificacoesPorStatus || [],
      porPrioridade: notificacoesPorPrioridade || []
    });

  } catch (error) {
    console.error("Erro ao obter dashboard:", error);
    res.status(500).json({ mensagem: "Erro interno ao obter dashboard." });
  }
};

// ✅ ADICIONADO: Método para excluir notificação
export const excluirNotificacao = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const query = 'DELETE FROM notificacoes_personalizadas WHERE id = ? AND status IN ("pendente", "erro", "cancelada")';
    const [result] = await db.promise().query(query, [parseInt(id)]);

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: "Notificação excluída com sucesso!" });
    } else {
      res.status(400).json({ mensagem: "Notificação não encontrada ou não pode ser excluída" });
    }

  } catch (error) {
    console.error("Erro ao excluir notificação:", error);
    res.status(500).json({ mensagem: "Erro interno ao excluir notificação." });
  }
};