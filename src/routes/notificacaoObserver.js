import db from '../config/db.js';
import transporter from '../mailer.js';

class NotificacaoObserver {
    constructor() {
        this.ultimoEventoId = 0;
        this.ultimoColaboradorId = 0;
        this.ultimoAgregadoId = 0
        this.intervalId = null;
    }

    async iniciar() {
        console.log(' Observador de notificações iniciado...');
        
        await this.buscarIdsAtuais();
        
        this.intervalId = setInterval(async () => {
            await this.verificarNovosRegistros();
        }, 10000);
        
        console.log(' Observador rodando (verifica a cada 10 segundos)');
    }

    async buscarIdsAtuais() {
        try {
            const [eventos] = await db.promise().query('SELECT MAX(ID_Evento) as maxId FROM Evento');
            this.ultimoEventoId = eventos[0].maxId || 0;

            const [colaboradores] = await db.promise().query('SELECT MAX(ID_colaborador) as maxId FROM Colaboradores');
            this.ultimoColaboradorId = colaboradores[0].maxId || 0;
            
            const [agregados] = await db.promise().query('SELECT MAX(ID_agregado) as maxId FROM Agregados');
            this.ultimoAgregadoId = 0;

            console.log(`IDs atuais - Eventos: ${this.ultimoEventoId}, Colaboradores: ${this.ultimoColaboradorId}, Agregados: ${this.ultimoAgregadoId}`);
        } catch (error) {
            console.error(' Erro ao buscar IDs atuais:', error);
        }
    }

    async verificarNovosRegistros() {
        try {
            await this.verificarNovosEventos();
            await this.verificarNovosColaboradores();
            await this.verificarNovosAgregados();
        } catch (error) {
            console.error(' Erro no observador:', error);
        }
    }

    async verificarNovosEventos() {
        try {
            const [eventos] = await db.promise().query(
                'SELECT * FROM Evento WHERE ID_Evento > ? ORDER BY ID_Evento ASC',
                [this.ultimoEventoId]
            );

            for (const evento of eventos) {
                console.log(` Novo evento detectado: ${evento.Nome_Evento}`);
                
                // ENVIAR EMAIL DE CONFIRMAÇÃO PARA O CRIADOR DO EVENTO
                await this.enviarEmailConfirmacaoCriador(evento);
                
                const [participantes] = await db.promise().query(
                    'SELECT c.* FROM Colaboradores c INNER JOIN Participacao_Evento p ON c.ID_colaborador = p.ID_Colaborador WHERE p.ID_Evento = ?',
                    [evento.ID_Evento]
                );

                for (const participante of participantes) {
                    await this.enviarNotificacaoEvento(evento, participante);
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
                console.log(`👤 Novo colaborador detectado: ${colaborador.Nome_Col}`);
                await this.enviarEmailBoasVindas(colaborador);
                this.ultimoColaboradorId = colaborador.ID_colaborador;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos colaboradores:', error);
        }
    }

    async verificarNovosAgregados() {
        try {
            const [agregados] = await db.promise().query(
                'SELECT * FROM Agregados WHERE id_agregado > ? ORDER BY id_agregado ASC',
                [this.ultimoAgregadoId]
            );

            for (const agregado of agregados) {
                console.log(`👤 Novo agregado detectado: ${agregado.nome}`);
                await this.enviarEmailBoasVindasAg(agregado);
                this.ultimoAgregadoId = agregado.id_agregado;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos Agregados:', error);
        }
    }

    // NOVO MÉTODO: Enviar email de confirmação para o criador do evento
    async enviarEmailConfirmacaoCriador(evento) {
        try {
            // Buscar informações do criador do evento
            // Assumindo que há um campo Criado_Por ou similar na tabela Evento
            const [criadores] = await db.promise().query(
                'SELECT c.* FROM Colaboradores c WHERE c.ID_colaborador = ?',
                [evento.Criado_Por] // Ajuste este campo conforme sua estrutura
            );

            if (criadores.length === 0) {
                console.log(' Criador do evento não encontrado');
                return;
            }

            const criador = criadores[0];

            const mailOptions = {
                from: process.env.EMAIL_USER || 'eventos@newelog.com',
                to: criador.Email,
                subject: ` Confirmação de Criação de Evento - ${evento.Nome_Evento}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">Evento Criado com Sucesso! </h2>
                        <p>Olá <strong>${criador.Nome_Col}</strong>,</p>
                        <p>Seu evento foi criado com sucesso no sistema. Aqui estão os detalhes:</p>
                        
                        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
                            <h3 style="margin: 0; color: #059669;">${evento.Nome_Evento}</h3>
                            <p><strong> Data:</strong> ${new Date(evento.Data_Evento).toLocaleString('pt-BR')}</p>
                            <p><strong> Local:</strong> ${evento.Local_Evento}</p>
                            <p><strong> Descrição:</strong> ${evento.Descricao}</p>
                            <p><strong> ID do Evento:</strong> ${evento.ID_Evento}</p>
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
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Email de confirmação enviado para o criador: ${criador.Email}`);
            
        } catch (error) {
            console.error(` Erro ao enviar email de confirmação para o criador:`, error);
        }
    }

    async enviarNotificacaoEvento(evento, colaborador) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'eventos@newelog.com',
                to: colaborador.Email,
                subject: ` Convite para Evento - ${evento.Nome_Evento}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Você foi convidado para um evento!</h2>
                        <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                        <p>Você está convidado para participar do evento:</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin: 0; color: #059669;">${evento.Nome_Evento}</h3>
                            <p><strong> Data:</strong> ${new Date(evento.Data_Evento).toLocaleString('pt-BR')}</p>
                            <p><strong> Local:</strong> ${evento.Local_Evento}</p>
                            <p><strong> Descrição:</strong> ${evento.Descricao}</p>
                        </div>
                        
                        <p>Por favor, acesse o sistema para confirmar sua participação.</p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost:3000" 
                               style="background: #2563eb; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                 Acessar Sistema
                            </a>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Notificação enviada para: ${colaborador.Email}`);
            
        } catch (error) {
            console.error(` Erro ao enviar notificação para ${colaborador.Email}:`, error);
        }
    }

    async enviarEmailBoasVindasAg(agregado) {
        console.log(agregado.email)
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'sistema@newelog.com',
                to: agregado.email,
                subject: 'Bem-vindo à Newe Log! ',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bem-vindo à Newe Log!</h2>
                        <p>Olá <strong>${agregado.nome}</strong>,</p>
                        <p>Seu cadastro foi realizado com sucesso no nosso sistema.</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Seus dados de acesso:</strong></p>
                            <p><strong>Nome:</strong> ${agregado.nome}</p>
                            <p><strong>Email:</strong> ${agregado.email}</p>
                            <p><strong>ID:</strong> ${agregado.id_agregado}</p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Atenciosamente,<br>
                            Equipe Newe Log
                        </p>
                    </div>
                `
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
                from: process.env.EMAIL_USER || 'sistema@newelog.com',
                to: colaborador.Email,
                subject: 'Bem-vindo à Newe Log! ',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bem-vindo à Newe Log!</h2>
                        <p>Olá <strong>${colaborador.Nome_Col}</strong>,</p>
                        <p>Seu cadastro foi realizado com sucesso no nosso sistema.</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Seus dados de acesso:</strong></p>
                            <p><strong>Nome:</strong> ${colaborador.Nome_Col}</p>
                            <p><strong>Email:</strong> ${colaborador.Email}</p>
                            <p><strong>ID:</strong> ${colaborador.ID_colaborador}</p>
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
                `
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
            console.log(' Observador de notificações parado');
        }
    }
}

const notificacaoObserver = new NotificacaoObserver();

notificacaoObserver.iniciar();

export default notificacaoObserver;