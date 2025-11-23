import db from "../config/db.js";
import transporter from "../mailer.js";

class NotificacaoObserver {
  constructor() {
    this.ultimoEventoId = 0;
    this.ultimoColaboradorId = 0;
    this.ultimoAgregadoId = 0;
    this.ultimoNotificacaoPersonalizadaId = 0;
    this.intervalId = null;
  }

  async iniciar() {
    console.log(" Observador de notificações iniciado...");

    await this.buscarIdsAtuais();

    this.intervalId = setInterval(async () => {
      await this.verificarNovosRegistros();
    }, 10000);

    console.log(" Observador rodando (verifica a cada 10 segundos)");
  }

  async buscarIdsAtuais() {
    try {
      const [eventos] = await db
        .promise()
        .query("SELECT MAX(ID_Evento) as maxId FROM Evento");
      this.ultimoEventoId = eventos[0].maxId || 0;

      const [colaboradores] = await db
        .promise()
        .query("SELECT MAX(ID_colaborador) as maxId FROM Colaboradores");
      this.ultimoColaboradorId = colaboradores[0].maxId || 0;

      const [agregados] = await db
        .promise()
        .query("SELECT MAX(id_agregado) as maxId FROM Agregados");
      this.ultimoAgregadoId = agregados[0].maxId || 0;

      try {
        const [notificacoes] = await db.promise().query(`
                    SELECT MAX(id) as maxId FROM notificacoes_personalizadas 
                    WHERE tipo = 'personalizada'
                `);
        this.ultimoNotificacaoPersonalizadaId = notificacoes[0]?.maxId || 0;
      } catch (error) {
        console.log(" Tabela de notificações personalizadas ainda não existe");
        this.ultimoNotificacaoPersonalizadaId = 0;
      }

      console.log(
        ` IDs atuais - Eventos: ${this.ultimoEventoId}, Colaboradores: ${this.ultimoColaboradorId}, Agregados: ${this.ultimoAgregadoId}, Notificações: ${this.ultimoNotificacaoPersonalizadaId}`
      );
    } catch (error) {
      console.error(" Erro ao buscar IDs atuais:", error);
    }
  }

  async verificarNovosRegistros() {
    try {
      await this.verificarNovosEventos();
      await this.verificarNovosColaboradores();
      await this.verificarNovosAgregados();
      await this.verificarNotificacoesPersonalizadas();
    } catch (error) {
      console.error(" Erro no observador:", error);
    }
  }

  async verificarNotificacoesPersonalizadas() {
    try {
      const [tabelaExiste] = await db.promise().query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'notificacoes_personalizadas'
            `);

      if (tabelaExiste.length === 0) {
        await this.criarTabelaNotificacoesPersonalizadas();
        return;
      }

      const [notificacoes] = await db.promise().query(
        `SELECT * FROM notificacoes_personalizadas 
                 WHERE id > ? AND status = 'pendente' 
                 AND (agendamento IS NULL OR agendamento <= NOW())
                 ORDER BY id ASC`,
        [this.ultimoNotificacaoPersonalizadaId]
      );

      for (const notificacao of notificacoes) {
        console.log(
          ` Notificação personalizada detectada: ${notificacao.titulo}`
        );

        await this.processarNotificacaoPersonalizada(notificacao);
        this.ultimoNotificacaoPersonalizadaId = notificacao.id;
      }
    } catch (error) {
      console.error(" Erro ao verificar notificações personalizadas:", error);
    }
  }

  async criarTabelaNotificacoesPersonalizadas() {
    try {
      const createTableQuery = `
                CREATE TABLE notificacoes_personalizadas (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    titulo VARCHAR(255) NOT NULL,
                    mensagem TEXT NOT NULL,
                    tipo ENUM('personalizada', 'sistema', 'lembrete') DEFAULT 'personalizada',
                    destinatarios JSON,
                    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
                    agendamento DATETIME NULL,
                    status ENUM('pendente', 'enviada', 'cancelada', 'erro') DEFAULT 'pendente',
                    criado_por INT,
                    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    enviado_em DATETIME NULL,
                    FOREIGN KEY (criado_por) REFERENCES Colaboradores(ID_colaborador)
                )
            `;

      await db.promise().query(createTableQuery);
      console.log(" Tabela de notificações personalizadas criada com sucesso!");

      await this.inserirNotificacoesExemplo();
    } catch (error) {
      console.error("❌ Erro ao criar tabela de notificações:", error);
    }
  }

  async inserirNotificacoesExemplo() {
    try {
      const notificacoesExemplo = [
        {
          titulo: "Bem-vindo ao Sistema de Notificações",
          mensagem:
            "Agora você pode enviar notificações personalizadas para colaboradores através do sistema.",
          destinatarios: JSON.stringify("todos"),
          prioridade: "media",
          criado_por: 1,
        },
        {
          titulo: "Manutenção Programada",
          mensagem:
            "Faremos uma manutenção no sistema no próximo sábado das 08h às 12h. O sistema ficará indisponível durante este período.",
          destinatarios: JSON.stringify("todos"),
          prioridade: "alta",
          criado_por: 1,
        },
      ];

      for (const notificacao of notificacoesExemplo) {
        await db
          .promise()
          .query(
            "INSERT INTO notificacoes_personalizadas (titulo, mensagem, destinatarios, prioridade, criado_por) VALUES (?, ?, ?, ?, ?)",
            [
              notificacao.titulo,
              notificacao.mensagem,
              notificacao.destinatarios,
              notificacao.prioridade,
              notificacao.criado_por,
            ]
          );
      }

      console.log(" Notificações de exemplo inseridas com sucesso!");
    } catch (error) {
      console.error(" Erro ao inserir notificações de exemplo:", error);
    }
  }

  async processarNotificacaoPersonalizada(notificacao) {
    try {
      let destinatarios = [];

      if (
        notificacao.destinatarios === "todos" ||
        notificacao.destinatarios === '"todos"'
      ) {
        const [todosColaboradores] = await db
          .promise()
          .query(
            'SELECT * FROM Colaboradores WHERE Email IS NOT NULL AND Email != ""'
          );
        destinatarios = todosColaboradores;
      } else {
        try {
          let idsDestinatarios;

          if (typeof notificacao.destinatarios === "string") {
            idsDestinatarios = JSON.parse(notificacao.destinatarios);
          } else {
            idsDestinatarios = notificacao.destinatarios;
          }

          if (Array.isArray(idsDestinatarios) && idsDestinatarios.length > 0) {
            const placeholders = idsDestinatarios.map(() => "?").join(",");
            const [colaboradoresSelecionados] = await db
              .promise()
              .query(
                `SELECT * FROM Colaboradores WHERE ID_colaborador IN (${placeholders}) AND Email IS NOT NULL AND Email != ""`,
                idsDestinatarios
              );
            destinatarios = colaboradoresSelecionados;
          }
        } catch (parseError) {
          console.error(" Erro ao parsear destinatários:", parseError);
          if (
            typeof notificacao.destinatarios === "string" &&
            !isNaN(notificacao.destinatarios)
          ) {
            const [colaborador] = await db
              .promise()
              .query(
                'SELECT * FROM Colaboradores WHERE ID_colaborador = ? AND Email IS NOT NULL AND Email != ""',
                [parseInt(notificacao.destinatarios)]
              );
            if (colaborador.length > 0) {
              destinatarios = colaborador;
            }
          }
        }
      }

      if (destinatarios.length === 0) {
        console.log(" Nenhum destinatário encontrado para a notificação");
        await this.marcarNotificacaoComoErro(
          notificacao.id,
          "Nenhum destinatário válido encontrado"
        );
        return;
      }

      let enviados = 0;
      let erros = 0;

      for (const destinatario of destinatarios) {
        try {
          await this.enviarNotificacaoPersonalizada(notificacao, destinatario);
          enviados++;
        } catch (error) {
          console.error(` Erro ao enviar para ${destinatario.Email}:`, error);
          erros++;
        }
      }

      if (erros === 0) {
        await this.marcarNotificacaoComoEnviada(notificacao.id, enviados);
        console.log(
          ` Notificação "${notificacao.titulo}" enviada para ${enviados} destinatários`
        );
      } else if (enviados > 0) {
        await this.marcarNotificacaoComoParcial(
          notificacao.id,
          enviados,
          erros
        );
        console.log(
          ` Notificação "${notificacao.titulo}" enviada para ${enviados} destinatários, ${erros} erros`
        );
      } else {
        await this.marcarNotificacaoComoErro(
          notificacao.id,
          "Falha ao enviar para todos os destinatários"
        );
        console.log(
          ` Notificação "${notificacao.titulo}" falhou para todos os destinatários`
        );
      }
    } catch (error) {
      console.error(" Erro ao processar notificação personalizada:", error);
      await this.marcarNotificacaoComoErro(notificacao.id, error.message);
    }
  }

  async enviarNotificacaoPersonalizada(notificacao, destinatario) {
    const mailOptions = {
      from: process.env.EMAIL_USER || "notificacoes@newelog.com",
      to: destinatario.Email,
      subject: ` ${notificacao.titulo}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">${
                          notificacao.titulo
                        }</h1>
                    </div>
                    
                    <div style="padding: 25px; background: #f8fafc; border-radius: 0 0 10px 10px;">
                        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                            ${notificacao.mensagem.replace(/\n/g, "<br>")}
                        </p>
                        
                        <div style="margin: 25px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                <strong>Prioridade:</strong> ${this.formatarPrioridade(
                                  notificacao.prioridade
                                )}<br>
                                <strong>Enviado em:</strong> ${new Date().toLocaleString(
                                  "pt-BR"
                                )}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:3000" 
                               style="background: #667eea; color: white; padding: 14px 28px; 
                                      text-decoration: none; border-radius: 8px; display: inline-block;
                                      font-weight: bold; font-size: 16px;">
                                 Acessar Sistema
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <p style="margin: 0; color: #64748b; font-size: 12px;">
                            Esta é uma notificação do sistema Newe Log.<br>
                            Por favor, não responda este email.
                        </p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  }

  formatarPrioridade(prioridade) {
    const prioridades = {
      baixa: " Baixa",
      media: " Média",
      alta: " Alta",
      urgente: " Urgente",
    };
    return prioridades[prioridade] || " Média";
  }

  async marcarNotificacaoComoEnviada(notificacaoId, totalEnviados) {
    await db
      .promise()
      .query(
        'UPDATE notificacoes_personalizadas SET status = "enviada", enviado_em = NOW() WHERE id = ?',
        [notificacaoId]
      );
  }

  async marcarNotificacaoComoParcial(notificacaoId, enviados, erros) {
    await db
      .promise()
      .query(
        'UPDATE notificacoes_personalizadas SET status = "enviada", enviado_em = NOW() WHERE id = ?',
        [notificacaoId]
      );
  }

  async marcarNotificacaoComoErro(notificacaoId, mensagemErro) {
    await db
      .promise()
      .query(
        'UPDATE notificacoes_personalizadas SET status = "erro" WHERE id = ?',
        [notificacaoId]
      );
  }

  static async criarNotificacao(dadosNotificacao) {
    try {
      const {
        titulo,
        mensagem,
        destinatarios,
        prioridade = "media",
        criado_por,
        agendamento = null,
      } = dadosNotificacao;

      const [tabelaExiste] = await db.promise().query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'notificacoes_personalizadas'
            `);

      if (tabelaExiste.length === 0) {
        return { success: false, error: "Tabela de notificações não existe" };
      }

      const query = `
                INSERT INTO notificacoes_personalizadas 
                (titulo, mensagem, destinatarios, prioridade, criado_por, agendamento, tipo)
                VALUES (?, ?, ?, ?, ?, ?, 'personalizada')
            `;

      const [result] = await db
        .promise()
        .query(query, [
          titulo,
          mensagem,
          JSON.stringify(destinatarios),
          prioridade,
          criado_por,
          agendamento,
        ]);

      console.log(
        ` Notificação personalizada criada: ${titulo} (ID: ${result.insertId})`
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error(" Erro ao criar notificação personalizada:", error);
      return { success: false, error: error.message };
    }
  }

  static async notificacaoRapida(titulo, mensagem, destinatarioId, criadoPor) {
    return await this.criarNotificacao({
      titulo,
      mensagem,
      destinatarios: [destinatarioId],
      prioridade: "media",
      criado_por: criadoPor,
    });
  }

  static async notificarTodos(
    titulo,
    mensagem,
    criadoPor,
    prioridade = "media"
  ) {
    return await this.criarNotificacao({
      titulo,
      mensagem,
      destinatarios: "todos",
      prioridade,
      criado_por: criadoPor,
    });
  }

  async verificarNovosEventos() {
    try {
      const [eventos] = await db
        .promise()
        .query(
          "SELECT * FROM Evento WHERE ID_Evento > ? ORDER BY ID_Evento ASC",
          [this.ultimoEventoId]
        );

      for (const evento of eventos) {
        console.log(` Novo evento detectado: ${evento.Nome_Evento}`);

        await this.enviarEmailConfirmacaoCriador(evento);

        const [participantes] = await db
          .promise()
          .query(
            "SELECT c.* FROM Colaboradores c INNER JOIN Participacao_Evento p ON c.ID_colaborador = p.ID_Colaborador WHERE p.ID_Evento = ?",
            [evento.ID_Evento]
          );

        for (const participante of participantes) {
          await this.enviarNotificacaoEvento(evento, participante);
        }

        this.ultimoEventoId = evento.ID_Evento;
      }
    } catch (error) {
      console.error(" Erro ao verificar novos eventos:", error);
    }
  }

  async verificarNovosColaboradores() {
    try {
      const [colaboradores] = await db
        .promise()
        .query(
          "SELECT * FROM Colaboradores WHERE ID_colaborador > ? ORDER BY ID_colaborador ASC",
          [this.ultimoColaboradorId]
        );

      for (const colaborador of colaboradores) {
        console.log(` Novo colaborador detectado: ${colaborador.Nome_Col}`);
        await this.enviarEmailBoasVindas(colaborador);
        this.ultimoColaboradorId = colaborador.ID_colaborador;
      }
    } catch (error) {
      console.error(" Erro ao verificar novos colaboradores:", error);
    }
  }

  async verificarNovosAgregados() {
    try {
      const [agregados] = await db
        .promise()
        .query(
          "SELECT * FROM Agregados WHERE id_agregado > ? ORDER BY id_agregado ASC",
          [this.ultimoAgregadoId]
        );

      for (const agregado of agregados) {
        console.log(` Novo agregado detectado: ${agregado.nome}`);
        await this.enviarEmailBoasVindasAg(agregado);
        this.ultimoAgregadoId = agregado.id_agregado;
      }
    } catch (error) {
      console.error(" Erro ao verificar novos Agregados:", error);
    }
  }

  async enviarEmailConfirmacaoCriador(evento) {
    try {
      const [criadores] = await db
        .promise()
        .query("SELECT c.* FROM Colaboradores c WHERE c.ID_colaborador = ?", [
          evento.Criado_Por || 1,
        ]);

      if (criadores.length === 0) {
        console.log(" Criador do evento não encontrado");
        return;
      }

      const criador = criadores[0];

      const mailOptions = {
        from: process.env.EMAIL_USER || "eventos@newelog.com",
        to: criador.Email,
        subject: ` Confirmação de Criação de Evento - ${evento.Nome_Evento}`,
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">Evento Criado com Sucesso! </h2>
                        <p>Olá <strong>${criador.Nome_Col}</strong>,</p>
                        <p>Seu evento foi criado com sucesso no sistema. Aqui estão os detalhes:</p>
                        
                        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
                            <h3 style="margin: 0; color: #059669;">${
                              evento.Nome_Evento
                            }</h3>
                            <p><strong> Data:</strong> ${new Date(
                              evento.Data_Evento
                            ).toLocaleString("pt-BR")}</p>
                            <p><strong> Local:</strong> ${
                              evento.Local_Evento
                            }</p>
                            <p><strong> Descrição:</strong> ${
                              evento.Descricao
                            }</p>
                            <p><strong> ID do Evento:</strong> ${
                              evento.ID_Evento
                            }</p>
                        </div>
                        
                        <p style="color: #059669; font-weight: bold;">
                             As notificações foram enviadas para todos os participantes convidados.
                        </p>
                        
                        <p>Você pode gerenciar seu evento acessando o sistema:</p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost:3000" 
                               style="background: #059669; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                  Acessar Sistema
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Este é um email de confirmação automática.<br>
                            Equipe Newe Log
                        </p>
                    </div>
                `,
      };

      await transporter.sendMail(mailOptions);
      console.log(
        ` Email de confirmação enviado para o criador: ${criador.Email}`
      );
    } catch (error) {
      console.error(
        ` Erro ao enviar email de confirmação para o criador:`,
        error
      );
    }
  }

  async enviarNotificacaoEvento(evento, colaborador) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || "eventos@newelog.com",
        to: colaborador.Email,
        subject: ` Convite para Evento - ${evento.Nome_Evento}`,
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Você foi convidado para um evento!</h2>
                        <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                        <p>Você está convidado para participar do evento:</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin: 0; color: #059669;">${
                              evento.Nome_Evento
                            }</h3>
                            <p><strong> Data:</strong> ${new Date(
                              evento.Data_Evento
                            ).toLocaleString("pt-BR")}</p>
                            <p><strong> Local:</strong> ${
                              evento.Local_Evento
                            }</p>
                            <p><strong> Descrição:</strong> ${
                              evento.Descricao
                            }</p>
                        </div>
                        
                        <p>Por favor, acesse o sistema para confirmar sua participação.</p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost:3000" 
                               style="background: #2563eb; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                 ✅ Acessar Sistema
                            </a>
                        </div>
                    </div>
                `,
      };

      await transporter.sendMail(mailOptions);
      console.log(` Notificação enviada para: ${colaborador.Email}`);
    } catch (error) {
      console.error(
        ` Erro ao enviar notificação para ${colaborador.Email}:`,
        error
      );
    }
  }

  async enviarEmailBoasVindasAg(agregado) {
    try {
      if (!agregado.email) {
        console.log(" Agregado sem email:", agregado.nome);
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER || "sistema@newelog.com",
        to: agregado.email,
        subject: " Bem-vindo à Newe Log!",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bem-vindo à Newe Log!</h2>
                        <p>Olá <strong>${agregado.nome}</strong>,</p>
                        <p>Seu cadastro foi realizado com sucesso no nosso sistema.</p>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Atenciosamente,<br>
                            Equipe Newe Log
                        </p>
                    </div>
                `,
      };

      await transporter.sendMail(mailOptions);
      console.log(` Email de boas-vindas enviado para: ${agregado.email}`);
    } catch (error) {
      console.error(` Erro ao enviar email para ${agregado.email}:`, error);
    }
  }

  async enviarEmailBoasVindas(colaborador) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || "sistema@newelog.com",
        to: colaborador.Email,
        subject: " Bem-vindo à Newe Log!",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bem-vindo à Newe Log!</h2>
                        <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                        <p>Seu cadastro foi realizado com sucesso no nosso sistema.</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Seus dados de acesso:</strong></p>
                            <p><strong> Nome:</strong> ${colaborador.Nome_Col}</p>
                            <p><strong> Email:</strong> ${colaborador.Email}</p>
                            <p><strong> ID:</strong> ${colaborador.ID_colaborador}</p>
                        </div>
                        
                        <p>Você já pode fazer login no sistema usando suas credenciais.</p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost:3000" 
                               style="background: #059669; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                  Fazer Login
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Atenciosamente,<br>
                            Equipe Newe Log
                        </p>
                    </div>
                `,
      };

      await transporter.sendMail(mailOptions);
      console.log(` Email de boas-vindas enviado para: ${colaborador.Email}`);
    } catch (error) {
      console.error(` Erro ao enviar email para ${colaborador.Email}:`, error);
    }
  }

  parar() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log(" Observador de notificações parado");
    }
  }
}

const notificacaoObserver = new NotificacaoObserver();
notificacaoObserver.iniciar();

export default notificacaoObserver;
