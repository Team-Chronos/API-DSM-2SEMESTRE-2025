import db from '../config/db.js';
import transporter from '../utils/mailer.js';

class NotificacaoObserver {
    constructor() {
        this.ultimoEventoId = 0;
        this.ultimoColaboradorId = 0;
        this.ultimoAgregadoId = 0;
        this.ultimoNotificacaoPersonalizadaId = 0;
        this.ultimoParticipacaoId = 0;
        this.intervalId = null;
        this.ativo = false;
        this.processando = false;
    }

    async iniciar() {
        console.log(' Iniciando observador de notificações...');
        
        try {
            console.log(' Verificando configuração de email...');
            await transporter.verify();
            console.log(' Servidor de email configurado com sucesso!');
            
            await this.buscarIdsAtuais();
            
            this.intervalId = setInterval(async () => {
                if (!this.processando) {
                    await this.verificarNovosRegistros();
                }
            }, 30000);
            
            this.ativo = true;
            
            const processadas = await this.processarNotificacoesPendentes();
            console.log(` ${processadas} notificação(ões) processada(s) na inicialização`);
            
        } catch (error) {
            console.error(' Erro crítico ao iniciar observador:', error);
            console.log(' Observador de notificações desativado devido a erro de configuração');
        }
    }

    async buscarIdsAtuais() {
        try {
            const [eventos] = await db.promise().query('SELECT COALESCE(MAX(ID_Evento), 0) as maxId FROM Evento');
            this.ultimoEventoId = eventos[0].maxId;

            const [colaboradores] = await db.promise().query('SELECT COALESCE(MAX(ID_colaborador), 0) as maxId FROM Colaboradores');
            this.ultimoColaboradorId = colaboradores[0].maxId;
            
            try {
                const [agregados] = await db.promise().query('SELECT COALESCE(MAX(id_agregado), 0) as maxId FROM Agregados');
                this.ultimoAgregadoId = agregados[0].maxId;
            } catch (error) {
                console.log(' Tabela Agregados não encontrada, continuando sem monitorar agregados...');
                this.ultimoAgregadoId = 0;
            }

            try {
                const [tabelaExiste] = await db.promise().query(`
                    SELECT TABLE_NAME 
                    FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = 'notificacoes_personalizadas'
                `);

                if (tabelaExiste.length === 0) {
                    await this.criarTabelaNotificacoesPersonalizadas();
                }
            } catch (error) {
                await this.criarTabelaNotificacoesPersonalizadas();
            }
            try {
                await db.promise().query(`
                    SELECT notificado FROM Participacao_Evento LIMIT 1
                `);
            } catch (error) {
                console.log(' Adicionando coluna notificado na tabela Participacao_Evento...');
                await db.promise().query(`
                    ALTER TABLE Participacao_Evento 
                    ADD COLUMN notificado TINYINT(1) DEFAULT 0
                `);
                console.log(' Coluna notificado adicionada com sucesso!');
            }

        } catch (error) {
            console.error(' Erro ao buscar IDs atuais:', error);
        }
    }

    async verificarNovosRegistros() {
        if (!this.ativo || this.processando) return;

        try {
            this.processando = true;
            await this.verificarNotificacoesPersonalizadas();
            await this.verificarNovosEventos();
            await this.verificarNovosColaboradores();
            await this.verificarNovosAgregados();
            await this.verificarRespostasEventos();
            this.processando = false;
        } catch (error) {
            console.error(' Erro ao verificar novos registros:', error);
            this.processando = false;
        }
    }

    async verificarRespostasEventos() {
        try {
            console.log(' Verificando respostas de eventos...');
            
            try {
                await db.promise().query(`
                    SELECT notificado FROM Participacao_Evento LIMIT 1
                `);
            } catch (error) {
                console.log(' Coluna notificado não existe, criando...');
                await db.promise().query(`
                    ALTER TABLE Participacao_Evento 
                    ADD COLUMN notificado TINYINT(1) DEFAULT 0
                `);
                console.log(' Coluna notificado criada com sucesso!');
            }

            const [respostas] = await db.promise().query(`
                SELECT pe.*, e.Nome_Evento, e.Criado_Por, c.Nome_Col as nome_participante,
                       criador.Nome_Col as nome_criador, criador.Email as email_criador,
                       criador.ID_colaborador as id_criador
                FROM Participacao_Evento pe
                INNER JOIN Evento e ON pe.ID_Evento = e.ID_Evento
                INNER JOIN Colaboradores c ON pe.ID_Colaborador = c.ID_colaborador
                INNER JOIN Colaboradores criador ON e.Criado_Por = criador.ID_colaborador
                WHERE pe.criado_em > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                AND pe.ID_Status IN (2, 3) -- Confirmado (2) ou Recusado (3)
                AND (pe.notificado = 0 OR pe.notificado IS NULL)
                ORDER BY pe.criado_em DESC
                LIMIT 50
            `);

            console.log(` Encontradas ${respostas.length} respostas para processar`);

            for (const resposta of respostas) {
                await this.notificarRespostaEvento(resposta);
                await db.promise().query(
                    'UPDATE Participacao_Evento SET notificado = 1 WHERE ID_Evento = ? AND ID_Colaborador = ?',
                    [resposta.ID_Evento, resposta.ID_Colaborador]
                );
            }

        } catch (error) {
            console.error(' Erro ao verificar respostas de eventos:', error);
        }
    }

    async notificarRespostaEvento(resposta) {
        try {
            const statusTexto = resposta.ID_Status === 2 ? 'CONFIRMOU' : 'RECUSOU';
            const corStatus = resposta.ID_Status === 2 ? '#22c55e' : '#ef4444';
            const iconeStatus = resposta.ID_Status === 2 ? '✅' : '❌';

            const justificativaValida = resposta.justificativa && 
                                      resposta.justificativa !== 'null' && 
                                      resposta.justificativa.trim() !== '';

            const notificacaoData = {
                titulo: `${iconeStatus} Resposta de Participação`,
                mensagem: `${resposta.nome_participante} ${statusTexto.toLowerCase()} participação no evento "${resposta.Nome_Evento}"${justificativaValida ? `. Justificativa: ${resposta.justificativa}` : ''}`,
                destinatarios: [resposta.id_criador], 
                prioridade: 'media',
                criado_por: 1,
                tipo: 'sistema'
            };

            await NotificacaoObserver.criarNotificacao(notificacaoData);

            console.log(` Notificação criada para o criador do evento: ${resposta.nome_criador}`);

            if (resposta.email_criador && this.validarEmail(resposta.email_criador)) {
                const mensagemEmail = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                            <h1 style="margin: 0; font-size: 24px;">${iconeStatus} Resposta de Participação</h1>
                        </div>
                        
                        <div style="padding: 25px; background: #f8fafc; border-radius: 0 0 10px 10px;">
                            <p style="color: #4a5568; line-height: 1.6;">Olá <strong>${resposta.nome_criador}</strong>,</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${corStatus};">
                                <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
                                    <strong>${resposta.nome_participante}</strong> <span style="color: ${corStatus}; font-weight: bold;">${statusTexto}</span> participação no evento:
                                </p>
                                <h3 style="color: #374151; margin: 15px 0 10px 0;">${resposta.Nome_Evento}</h3>
                                ${justificativaValida ? `<p style="color: #6b7280; font-style: italic; margin: 10px 0 0 0;"><strong>Justificativa:</strong> ${resposta.justificativa}</p>` : ''}
                            </div>
                            
                            <div style="margin: 20px 0; padding: 15px; background: #edf2f7; border-radius: 8px;">
                                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                                    <strong>Data da resposta:</strong> ${new Date(resposta.criado_em).toLocaleString('pt-BR')}<br>
                                    <strong>Participante:</strong> ${resposta.nome_participante}
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173/eventos/${resposta.ID_Evento}" 
                                   style="background: #667eea; color: white; padding: 14px 28px; 
                                          text-decoration: none; border-radius: 8px; display: inline-block;
                                          font-weight: bold; font-size: 16px;">
                                     Ver Detalhes do Evento
                                </a>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                Esta é uma notificação automática do sistema Newe Log.<br>
                                Por favor, não responda este email.
                            </p>
                        </div>
                    </div>
                `;

                const mailOptions = {
                    from: 'apichronos7@gmail.com',
                    to: resposta.email_criador,
                    subject: `${iconeStatus} ${resposta.nome_participante} ${statusTexto.toLowerCase()} seu evento`,
                    html: mensagemEmail
                };

                await transporter.sendMail(mailOptions);
                console.log(` Email de notificação enviado para: ${resposta.email_criador}`);
            }

        } catch (error) {
            console.error(' Erro ao notificar resposta do evento:', error);
        }
    }

    static async notificarConvidadosEvento(eventoId, criadoPor) {
        try {
            const [eventos] = await db.promise().query(`
                SELECT e.*, c.Nome_Col as nome_criador 
                FROM Evento e 
                INNER JOIN Colaboradores c ON e.Criado_Por = c.ID_colaborador 
                WHERE e.ID_Evento = ?
            `, [eventoId]);

            if (eventos.length === 0) {
                return { success: false, error: 'Evento não encontrado' };
            }

            const evento = eventos[0];

            const [convidados] = await db.promise().query(`
                SELECT c.ID_colaborador, c.Nome_Col, c.Email 
                FROM Participacao_Evento pe
                INNER JOIN Colaboradores c ON pe.ID_Colaborador = c.ID_colaborador
                WHERE pe.ID_Evento = ?
            `, [eventoId]);

            if (convidados.length === 0) {
                return { success: false, error: 'Nenhum convidado encontrado para o evento' };
            }

            for (const convidado of convidados) {
                await this.enviarEmailConviteEvento(evento, convidado);
            }

            console.log(` Convites de evento enviados para ${convidados.length} convidados`);
            return { success: true, message: `Convites enviados para ${convidados.length} convidados` };

        } catch (error) {
            console.error(' Erro ao notificar convidados do evento:', error);
            return { success: false, error: error.message };
        }
    }

    static async notificarNovoEvento(eventoId) {
        try {
            console.log(` Notificando convidados sobre novo evento ID: ${eventoId}`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const [eventos] = await db.promise().query(`
                SELECT * FROM Evento WHERE ID_Evento = ?
            `, [eventoId]);

            console.log(` Resultado da query: ${eventos.length} evento(s) encontrado(s)`);

            if (eventos.length === 0) {
                console.log(` Evento ID ${eventoId} não encontrado no banco`);
                
                const [eventos2] = await db.promise().query(`
                    SELECT ID_Evento, Nome_Evento FROM Evento 
                    WHERE ID_Evento = ?
                `, [eventoId]);
                
                console.log(` Segunda tentativa: ${eventos2.length} evento(s)`);
                
                if (eventos2.length === 0) {
                    return { 
                        success: false, 
                        error: `Evento ID ${eventoId} não existe no banco`,
                        enviados: 0,
                        erros: 0
                    };
                }
            }

            const evento = eventos[0];
            console.log(` Evento encontrado: "${evento.Nome_Evento}" (ID: ${evento.ID_Evento})`);

            const [criadorInfo] = await db.promise().query(`
                SELECT Nome_Col, Email FROM Colaboradores 
                WHERE ID_colaborador = ?
            `, [evento.Criado_Por]);

            const nome_criador = criadorInfo.length > 0 ? criadorInfo[0].Nome_Col : 'Sistema';
            const email_criador = criadorInfo.length > 0 ? criadorInfo[0].Email : null;

            const [participantes] = await db.promise().query(`
                SELECT c.ID_colaborador, c.Nome_Col, c.Email 
                FROM Participacao_Evento pe
                INNER JOIN Colaboradores c ON pe.ID_Colaborador = c.ID_colaborador
                WHERE pe.ID_Evento = ?
            `, [eventoId]);

            console.log(` Participantes encontrados: ${participantes.length}`);

            if (participantes.length === 0) {
                console.log(' Nenhum participante encontrado para o evento');
                return { 
                    success: true, 
                    message: 'Evento criado sem participantes',
                    enviados: 0,
                    erros: 0
                };
            }

            console.log(`Enviando convites para ${participantes.length} participantes`);

            let enviados = 0;
            let erros = 0;

            for (const participante of participantes) {
                try {
                    // ✅ CORREÇÃO: Usar função de validação estática
                    if (participante.Email && NotificacaoObserver.validarEmail(participante.Email)) {
                        const eventoComCriador = {
                            ...evento,
                            nome_criador: nome_criador,
                            email_criador: email_criador
                        };
                        
                        await NotificacaoObserver.enviarEmailConviteEvento(eventoComCriador, participante);
                        enviados++;
                        console.log(` Email enviado para: ${participante.Email}`);
                    } else {
                        console.log(` Email inválido para: ${participante.Nome_Col}`);
                        erros++;
                    }
                } catch (error) {
                    console.error(` Falha ao enviar para ${participante.Email}:`, error.message);
                    erros++;
                }
            }

            console.log(` Resultado final: ${enviados} sucessos, ${erros} erros`);

            if (enviados > 0) {
                await NotificacaoObserver.criarNotificacao({
                    titulo: ' Novo Evento Criado',
                    mensagem: `Evento "${evento.Nome_Evento}" foi criado e convites enviados para ${enviados} participantes`,
                    destinatarios: [evento.Criado_Por],
                    prioridade: 'media',
                    criado_por: 1,
                    tipo: 'sistema'
                });
            }

            return { 
                success: true, 
                message: `Convites enviados para ${enviados} participantes`,
                enviados,
                erros
            };

        } catch (error) {
            console.error(' Erro ao notificar novo evento:', error);
            return { 
                success: false, 
                error: error.message,
                enviados: 0,
                erros: 0
            };
        }
    }

    static async enviarEmailConviteEvento(evento, convidado) {
        try {
            const mensagem = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                        <h1 style="margin: 0; font-size: 24px;"> Convite para Evento</h1>
                    </div>
                    
                    <div style="padding: 25px; background: #f8fafc; border-radius: 0 0 10px 10px;">
                        <p style="color: #4a5568; line-height: 1.6;">Olá <strong>${convidado.Nome_Col}</strong>,</p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                            <h2 style="color: #374151; margin: 0 0 15px 0;">${evento.Nome_Evento}</h2>
                            <p style="color: #4b5563; line-height: 1.6; margin: 5px 0;">
                                <strong> Data:</strong> ${new Date(evento.Data_Evento).toLocaleString('pt-BR')}
                            </p>
                            <p style="color: #4b5563; line-height: 1.6; margin: 5px 0;">
                                <strong> Local:</strong> ${evento.Local_Evento}
                            </p>
                            <p style="color: #4b5563; line-height: 1.6; margin: 5px 0;">
                                <strong> Duração:</strong> ${evento.Duracao_Evento}
                            </p>
                            <p style="color: #4b5563; line-height: 1.6; margin: 15px 0 0 0;">
                                ${evento.Descricao}
                            </p>
                        </div>
                        
                        <div style="margin: 20px 0; padding: 15px; background: #edf2f7; border-radius: 8px;">
                            <p style="margin: 0; color: #4a5568; font-size: 14px;">
                                <strong>Convidado por:</strong> ${evento.nome_criador}<br>
                                <strong>Enviado em:</strong> ${new Date().toLocaleString('pt-BR')}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #4a5568; margin-bottom: 15px;">
                                <strong>Confirme sua participação no sistema:</strong>
                            </p>
                            <a href="http://localhost:5173" 
                               style="background: #667eea; color: white; padding: 14px 28px; 
                                      text-decoration: none; border-radius: 8px; display: inline-block;
                                      font-weight: bold; font-size: 16px;">
                                 Acessar Eventos no Sistema
                            </a>
                        </div>

                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400e; font-size: 14px;">
                                <strong> Como confirmar sua participação:</strong><br>
                                1. Acesse o sistema pelo link acima<br>
                                2. Vá para a seção "Eventos"<br>
                                3. Encontre o evento "${evento.Nome_Evento}"<br>
                                4. Clique em "Confirmar" ou "Recusar"
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <p style="margin: 0; color: #64748b; font-size: 12px;">
                            Esta é uma notificação automática do sistema Newe Log.<br>
                            Por favor, não responda este email.
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: 'apichronos7@gmail.com',
                to: convidado.Email,
                subject: ` Convite: ${evento.Nome_Evento}`,
                html: mensagem
            };

            await transporter.sendMail(mailOptions);
            console.log(` Email de convite enviado para: ${convidado.Email}`);

        } catch (error) {
            console.error(` Erro ao enviar email para ${convidado.Email}:`, error);
            throw error;
        }
    }

    async verificarNotificacoesPersonalizadas() {
        try {
            const [notificacoes] = await db.promise().query(
                `SELECT * FROM notificacoes_personalizadas 
                 WHERE status = 'pendente' 
                 AND (agendamento IS NULL OR agendamento <= NOW())
                 ORDER BY id ASC
                 LIMIT 10`
            );

            for (const notificacao of notificacoes) {
                await this.processarNotificacaoPersonalizada(notificacao);
                this.ultimoNotificacaoPersonalizadaId = Math.max(this.ultimoNotificacaoPersonalizadaId, notificacao.id);
            }
        } catch (error) {
            console.error(' Erro ao verificar notificações personalizadas:', error);
        }
    }

    async processarNotificacoesPendentes() {
        try {
            console.log(' Processando notificações pendentes...');
            
            const [notificacoes] = await db.promise().query(
                `SELECT * FROM notificacoes_personalizadas 
                 WHERE status = 'pendente' 
                 AND (agendamento IS NULL OR agendamento <= NOW())
                 ORDER BY id ASC`
            );

            let processadas = 0;
            for (const notificacao of notificacoes) {
                await this.processarNotificacaoPersonalizada(notificacao);
                processadas++;
            }

            if (processadas > 0) {
                console.log(` ${processadas} notificação(ões) processada(s)`);
            }

            return processadas;

        } catch (error) {
            console.error(' Erro ao processar notificações pendentes:', error);
            return 0;
        }
    }

    async criarTabelaNotificacoesPersonalizadas() {
        try {
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS notificacoes_personalizadas (
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
            console.log(' Tabela de notificações personalizadas criada/verificada');
            
        } catch (error) {
            console.error(' Erro ao criar tabela de notificações:', error);
        }
    }

    async processarNotificacaoPersonalizada(notificacao) {
        try {
            console.log(` Processando notificação: ${notificacao.titulo}`);
            
            let destinatarios = [];
            let destinatariosRaw = notificacao.destinatarios;

            try {
                if (typeof destinatariosRaw === 'string') {
                    try {
                        destinatariosRaw = JSON.parse(destinatariosRaw);
                    } catch (parseError) {
                        console.log(' Erro ao parsear destinatários como JSON, tratando como string');
                    }
                }
            } catch (parseError) {
                console.log(' Erro ao processar destinatários');
            }

            if (destinatariosRaw === 'todos' || 
                destinatariosRaw === '"todos"' || 
                (typeof destinatariosRaw === 'string' && destinatariosRaw.includes('todos'))) {
                
                const [todosColaboradores] = await db.promise().query(
                    'SELECT * FROM Colaboradores WHERE Email IS NOT NULL AND Email != "" AND LENGTH(Email) > 5'
                );
                destinatarios = todosColaboradores;
                console.log(` Enviando para todos os ${destinatarios.length} colaboradores`);
            
            } else if (Array.isArray(destinatariosRaw) && destinatariosRaw.length > 0) {
                const placeholders = destinatariosRaw.map(() => '?').join(',');
                const [colaboradoresSelecionados] = await db.promise().query(
                    `SELECT * FROM Colaboradores WHERE ID_colaborador IN (${placeholders}) AND Email IS NOT NULL AND Email != "" AND LENGTH(Email) > 5`,
                    destinatariosRaw
                );
                destinatarios = colaboradoresSelecionados;
                console.log(` Enviando para ${destinatarios.length} colaboradores selecionados`);
            
            } else if (typeof destinatariosRaw === 'number' || (typeof destinatariosRaw === 'string' && !isNaN(destinatariosRaw))) {
                const [colaborador] = await db.promise().query(
                    'SELECT * FROM Colaboradores WHERE ID_colaborador = ? AND Email IS NOT NULL AND Email != "" AND LENGTH(Email) > 5',
                    [parseInt(destinatariosRaw)]
                );
                if (colaborador.length > 0) {
                    destinatarios = colaborador;
                    console.log(` Enviando para 1 colaborador específico`);
                }
            }

            if (destinatarios.length === 0) {
                console.log(' Nenhum destinatário válido encontrado');
                await this.marcarNotificacaoComoErro(notificacao.id, 'Nenhum destinatário válido encontrado');
                return;
            }

            let enviados = 0;
            let erros = 0;

            for (const destinatario of destinatarios) {
                try {
                    await this.enviarNotificacaoPersonalizada(notificacao, destinatario);
                    enviados++;
                } catch (error) {
                    console.error(` Falha ao enviar para ${destinatario.Email}:`, error.message);
                    erros++;
                }
            }

            if (enviados > 0 && erros === 0) {
                await this.marcarNotificacaoComoEnviada(notificacao.id, enviados);
                console.log(` Notificação ${notificacao.id} enviada com sucesso para ${enviados} destinatários`);
            } else if (enviados > 0) {
                await this.marcarNotificacaoComoParcial(notificacao.id, enviados, erros);
                console.log(` Notificação ${notificacao.id} enviada parcialmente: ${enviados} sucessos, ${erros} erros`);
            } else {
                await this.marcarNotificacaoComoErro(notificacao.id, 'Falha ao enviar para todos os destinatários');
                console.log(` Notificação ${notificacao.id} falhou para todos os destinatários`);
            }

        } catch (error) {
            console.error(' Erro ao processar notificação personalizada:', error);
            await this.marcarNotificacaoComoErro(notificacao.id, error.message);
        }
    }

    async enviarNotificacaoPersonalizada(notificacao, destinatario) {
        try {
            console.log(` Tentando enviar email para: ${destinatario.Email}`);
            
            const mailOptions = {
                from: 'apichronos7@gmail.com',
                to: destinatario.Email,
                subject: ` ${notificacao.titulo}`,
                html: this.criarTemplateEmail(notificacao, destinatario)
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(` Email enviado com sucesso para: ${destinatario.Email}`);
            
            return info;
        } catch (error) {
            console.error(` Falha ao enviar email para ${destinatario.Email}:`, error.message);
            throw error;
        }
    }

    criarTemplateEmail(notificacao, destinatario) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">${notificacao.titulo}</h1>
                </div>
                
                <div style="padding: 25px; background: #f8fafc; border-radius: 0 0 10px 10px;">
                    <p style="color: #4a5568; line-height: 1.6;">Olá <strong>${destinatario.Nome_Col}</strong>,</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
                            ${notificacao.mensagem.replace(/\n/g, '<br>')}
                        </p>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #edf2f7; border-radius: 8px;">
                        <p style="margin: 0; color: #4a5568; font-size: 14px;">
                            <strong> Prioridade:</strong> ${this.formatarPrioridade(notificacao.prioridade)}<br>
                            <strong> Enviado em:</strong> ${new Date().toLocaleString('pt-BR')}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173" 
                           style="background: #667eea; color: white; padding: 14px 28px; 
                                  text-decoration: none; border-radius: 8px; display: inline-block;
                                  font-weight: bold; font-size: 16px;">
                             Acessar Sistema
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">
                        Esta é uma notificação automática do sistema Newe Log.<br>
                        Por favor, não responda este email.
                    </p>
                </div>
            </div>
        `;
    }

    formatarPrioridade(prioridade) {
        const icones = {
            'baixa': '🔵 Baixa',
            'media': '🟡 Média', 
            'alta': '🟠 Alta',
            'urgente': '🔴 Urgente'
        };
        return icones[prioridade] || '🟡 Média';
    }

    async marcarNotificacaoComoEnviada(notificacaoId, totalEnviados) {
        await db.promise().query(
            'UPDATE notificacoes_personalizadas SET status = "enviada", enviado_em = NOW() WHERE id = ?',
            [notificacaoId]
        );
    }

    async marcarNotificacaoComoParcial(notificacaoId, enviados, erros) {
        await db.promise().query(
            'UPDATE notificacoes_personalizadas SET status = "enviada", enviado_em = NOW() WHERE id = ?',
            [notificacaoId]
        );
    }

    async marcarNotificacaoComoErro(notificacaoId, mensagemErro) {
        await db.promise().query(
            'UPDATE notificacoes_personalizadas SET status = "erro" WHERE id = ?',
            [notificacaoId]
        );
    }

    async verificarNovosEventos() {
        try {
            const [eventos] = await db.promise().query(
                'SELECT * FROM Evento WHERE ID_Evento > ? ORDER BY ID_Evento ASC',
                [this.ultimoEventoId]
            );

            for (const evento of eventos) {
                console.log(` Novo evento detectado: "${evento.Nome_Evento}" (ID: ${evento.ID_Evento})`);
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                try {
                    const resultado = await NotificacaoObserver.notificarNovoEvento(evento.ID_Evento);
                    
                    if (resultado.success) {
                        console.log(` Convites automáticos enviados: ${resultado.enviados} sucessos, ${resultado.erros} erros`);
                    } else {
                        console.log(` Falha nos convites automáticos: ${resultado.error}`);
                    }
                } catch (error) {
                    console.error(` Erro crítico ao enviar convites para evento ${evento.ID_Evento}:`, error);
                }
                
                this.ultimoEventoId = evento.ID_Evento;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos eventos:', error);
        }
    }

    async verificarNovosColaboradores() {
        try {
            const [colaboradores] = await db.promise().query(
                'SELECT * FROM Colaboradores WHERE ID_colaborador > ? ORDER BY ID_colaborador ASC',
                [this.ultimoColaboradorId]
            );

            for (const colaborador of colaboradores) {
                this.ultimoColaboradorId = colaborador.ID_colaborador;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos colaboradores:', error);
        }
    }

    async verificarNovosAgregados() {
        try {
            const [tabelaExiste] = await db.promise().query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'agregados'
            `);
            
            if (tabelaExiste.length === 0) {
                return; 
            }

            const [agregados] = await db.promise().query(
                'SELECT * FROM Agregados WHERE id_agregado > ? ORDER BY id_agregado ASC',
                [this.ultimoAgregadoId]
            );

            for (const agregado of agregados) {
                this.ultimoAgregadoId = agregado.id_agregado;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos agregados:', error);
        }
    }

    static async criarNotificacao(dadosNotificacao) {
        try {
            const { titulo, mensagem, destinatarios, prioridade = 'media', criado_por, agendamento = null, tipo = 'personalizada' } = dadosNotificacao;

            let destinatariosParaSalvar;
            if (destinatarios === 'todos') {
                destinatariosParaSalvar = JSON.stringify('todos');
            } else if (Array.isArray(destinatarios)) {
                destinatariosParaSalvar = JSON.stringify(destinatarios);
            } else {
                destinatariosParaSalvar = JSON.stringify([destinatarios]);
            }

            const query = `
                INSERT INTO notificacoes_personalizadas 
                (titulo, mensagem, destinatarios, prioridade, criado_por, agendamento, tipo)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.promise().query(query, [
                titulo,
                mensagem,
                destinatariosParaSalvar,
                prioridade,
                criado_por,
                agendamento,
                tipo
            ]);

            console.log(` Notificação criada com ID: ${result.insertId}`);
            return { success: true, id: result.insertId };

        } catch (error) {
            console.error(' Erro ao criar notificação personalizada:', error);
            return { success: false, error: error.message };
        }
    }

    static async notificacaoRapida(titulo, mensagem, destinatarioId, criadoPor) {
        return await this.criarNotificacao({
            titulo,
            mensagem,
            destinatarios: [destinatarioId],
            prioridade: 'media',
            criado_por: criadoPor
        });
    }

    static async notificarTodos(titulo, mensagem, criadoPor, prioridade = 'media') {
        return await this.criarNotificacao({
            titulo,
            mensagem,
            destinatarios: 'todos',
            prioridade,
            criado_por: criadoPor
        });
    }

    async obterEstatisticas() {
        try {
            const [tabelaExiste] = await db.promise().query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'notificacoes_personalizadas'
            `);

            if (tabelaExiste.length === 0) {
                return {
                    totalNotificacoes: 0,
                    pendentes: 0,
                    enviadas: 0,
                    totalColaboradores: 0
                };
            }

            const [totalNotificacoes] = await db.promise().query(
                'SELECT COUNT(*) as total FROM notificacoes_personalizadas'
            );
            
            const [notificacoesPendentes] = await db.promise().query(
                'SELECT COUNT(*) as pendentes FROM notificacoes_personalizadas WHERE status = "pendente"'
            );
            
            const [notificacoesEnviadas] = await db.promise().query(
                'SELECT COUNT(*) as enviadas FROM notificacoes_personalizadas WHERE status = "enviada"'
            );

            const [totalColaboradores] = await db.promise().query(
                'SELECT COUNT(*) as total FROM Colaboradores WHERE Email IS NOT NULL AND Email != ""'
            );

            return {
                totalNotificacoes: totalNotificacoes[0].total,
                pendentes: notificacoesPendentes[0].pendentes,
                enviadas: notificacoesEnviadas[0].enviadas,
                totalColaboradores: totalColaboradores[0].total
            };
        } catch (error) {
            console.error(' Erro ao obter estatísticas:', error);
            return null;
        }
    }

    parar() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.ativo = false;
            console.log(' Observador de notificações parado');
        }
    }

    validarEmail(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.length > 5;
    }

    static validarEmail(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.length > 5;
    }
}

const notificacaoObserver = new NotificacaoObserver();

export { NotificacaoObserver };

export default notificacaoObserver;