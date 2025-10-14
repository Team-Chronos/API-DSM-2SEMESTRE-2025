import db from '../config/db.js';
import transporter from '../mailer.js';

class NotificacaoObserver {
    private ultimoEventoId: number;
    private ultimoColaboradorId: number;
    private ultimoAgregadoId: number;
    private intervalId: NodeJS.Timeout | null;

    constructor() {
        this.ultimoEventoId = 0;
        this.ultimoColaboradorId = 0;
        this.ultimoAgregadoId = 0;
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
            const [eventos]: [any[], any] = await db.promise().query('SELECT MAX(ID_Evento) as maxId FROM Evento');
            this.ultimoEventoId = eventos[0]?.maxId || 0;

            const [colaboradores]: [any[], any] = await db.promise().query('SELECT MAX(ID_colaborador) as maxId FROM Colaboradores');
            this.ultimoColaboradorId = colaboradores[0]?.maxId || 0;
            
            const [agregados]: [any[], any] = await db.promise().query('SELECT MAX(ID_agregado) as maxId FROM Agregados');
            this.ultimoAgregadoId = agregados[0]?.maxId || 0;

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
            const [eventos]: [any[], any] = await db.promise().query(
                'SELECT * FROM Evento WHERE ID_Evento > ? ORDER BY ID_Evento ASC',
                [this.ultimoEventoId]
            );

            for (const evento of eventos) {
                console.log(` Novo evento detectado: ${evento.Nome_Evento}`);
                
                await this.enviarEmailConfirmacaoCriador(evento);
                
                const [participantes]: [any[], any] = await db.promise().query(
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
            const [colaboradores]: [any[], any] = await db.promise().query(
                'SELECT * FROM Colaboradores WHERE ID_colaborador > ? ORDER BY ID_colaborador ASC',
                [this.ultimoColaboradorId]
            );

            for (const colaborador of colaboradores) {
                console.log(` Novo colaborador detectado: ${colaborador.Nome_Col}`);
                await this.enviarEmailBoasVindas(colaborador);
                this.ultimoColaboradorId = colaborador.ID_colaborador;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos colaboradores:', error);
        }
    }

    async verificarNovosAgregados() {
        try {
            const [agregados]: [any[], any] = await db.promise().query(
                'SELECT * FROM Agregados WHERE id_agregado > ? ORDER BY id_agregado ASC',
                [this.ultimoAgregadoId]
            );

            for (const agregado of agregados) {
                console.log(` Novo agregado detectado: ${agregado.nome}`);
                await this.enviarEmailBoasVindasAg(agregado);
                this.ultimoAgregadoId = agregado.id_agregado;
            }
        } catch (error) {
            console.error(' Erro ao verificar novos Agregados:', error);
        }
    }

    async enviarEmailConfirmacaoCriador(evento: any) {
        try {
            const [criadores]: [any[], any] = await db.promise().query(
                'SELECT c.* FROM Colaboradores c WHERE c.ID_colaborador = ?',
                [evento.Criado_Por]
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

    async enviarNotificacaoEvento(evento: any, colaborador: any) {
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
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Este é um email automático.<br>
                            Equipe Newe Log
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Notificação enviada para: ${colaborador.Email}`);

        } catch (error) {
            console.error(` Erro ao enviar notificação para colaborador:`, error);
        }
    }

    async enviarEmailBoasVindasAg(agregado: any) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'eventos@newelog.com',
                to: agregado.email,
                subject: ` Bem-vindo ao sistema - Agregado`,
                html: `
                    <div>
                        <h2>Olá ${agregado.nome}, seja bem-vindo(a)!</h2>
                        <p>Você foi cadastrado(a) como agregado no nosso sistema.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Email de boas-vindas enviado para agregado: ${agregado.email}`);

        } catch (error) {
            console.error(` Erro ao enviar email de boas-vindas para agregado:`, error);
        }
    }

    async enviarEmailBoasVindas(colaborador: any) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'eventos@newelog.com',
                to: colaborador.Email,
                subject: ` Bem-vindo ao sistema - Colaborador`,
                html: `
                    <div>
                        <h2>Olá ${colaborador.Nome_Col}, seja bem-vindo(a)!</h2>
                        <p>Você foi cadastrado(a) como colaborador no nosso sistema.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Email de boas-vindas enviado para colaborador: ${colaborador.Email}`);

        } catch (error) {
            console.error(` Erro ao enviar email de boas-vindas para colaborador:`, error);
        }
    }

    parar() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log(' Observador de notificações parado.');
        }
    }
}

export default NotificacaoObserver;
