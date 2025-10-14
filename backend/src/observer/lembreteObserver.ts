import db from '../config/db.js';
import transporter from '../mailer.js';

class LembreteObserver {
    private intervalId: NodeJS.Timeout | null = null;

    async iniciar() {
        console.log('⏰ Sistema de lembretes iniciado...');
        
        this.intervalId = setInterval(async () => {
            await this.verificarLembretes();
        }, 60000); 
        
        console.log(' Lembretes rodando (verifica a cada 1 minuto)');
    }

    private async verificarLembretes() {
        try {
            const [tarefasProximas]: [any[], any] = await db.promise().query(
                `SELECT 
                    a.*,
                    c.Nome_Col as Nome_Vendedor,
                    c.Email as Email_Vendedor,
                    cl.Nome_Cliente,
                    cl.Telefone_Cliente
                 FROM Agenda a
                 INNER JOIN Colaboradores c ON a.ID_Colaborador = c.ID_colaborador
                 LEFT JOIN Cliente cl ON a.ID_Cliente = cl.ID_Cliente
                 WHERE a.Status = 'Pendente'
                 AND a.Data_Hora_Inicio BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 15 MINUTE)
                 AND a.Data_Hora_Inicio > DATE_SUB(NOW(), INTERVAL 5 MINUTE)`
            );

            for (const tarefa of tarefasProximas) {
                console.log(` Lembrete: Tarefa "${tarefa.Titulo}" em 15 minutos`);
                await this.enviarLembrete(tarefa);
                
                await db.promise().query(
                    'UPDATE Agenda SET Status = "Em andamento" WHERE ID_Agenda = ?',
                    [tarefa.ID_Agenda]
                );
            }

            await this.enviarResumoDiario();

        } catch (error) {
            console.error(' Erro ao verificar lembretes:', error);
        }
    }

    private async enviarLembrete(tarefa: any) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'lembretes@empresa.com',
                to: tarefa.Email_Vendedor,
                subject: ` LEMBRETE: ${tarefa.Titulo}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc2626;">⏰ LEMBRETE IMPORTANTE</h2>
                        
                        <div style="background: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc2626;">
                            <h3 style="margin: 0; color: #dc2626;">${tarefa.Titulo}</h3>
                            <p><strong> Horário:</strong> ${new Date(tarefa.Data_Hora_Inicio).toLocaleString('pt-BR')}</p>
                            ${tarefa.Nome_Cliente ? `<p><strong> Cliente:</strong> ${tarefa.Nome_Cliente}</p>` : ''}
                            ${tarefa.Local_Evento ? `<p><strong> Local:</strong> ${tarefa.Local_Evento}</p>` : ''}
                            <p><strong> Descrição:</strong> ${tarefa.Descricao}</p>
                        </div>
                        
                        <p style="color: #dc2626; font-weight: bold;">
                            Esta tarefa está programada para começar em 15 minutos!
                        </p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="http://localhost:3000/agenda" 
                               style="background: #dc2626; color: white; padding: 10px 20px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                 Ver Agenda
                            </a>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Lembrete enviado para: ${tarefa.Email_Vendedor}`);

        } catch (error) {
            console.error(' Erro ao enviar lembrete:', error);
        }
    }

    private async enviarResumoDiario() {
        try {
            const agora = new Date();
            if (agora.getHours() === 8 && agora.getMinutes() === 0) {
                
                const [vendedores]: [any[], any] = await db.promise().query(
                    'SELECT * FROM Colaboradores WHERE Email IS NOT NULL'
                );

                for (const vendedor of vendedores) {
                    const [tarefasHoje]: [any[], any] = await db.promise().query(
                        `SELECT * FROM Agenda 
                         WHERE ID_Colaborador = ? 
                         AND DATE(Data_Hora_Inicio) = CURDATE()
                         AND Status = 'Pendente'
                         ORDER BY Data_Hora_Inicio ASC`,
                        [vendedor.ID_colaborador]
                    );

                    if (tarefasHoje.length > 0) {
                        await this.enviarEmailResumoDiario(vendedor, tarefasHoje);
                    }
                }
            }
        } catch (error) {
            console.error(' Erro ao enviar resumo diário:', error);
        }
    }

    private async enviarEmailResumoDiario(vendedor: any, tarefas: any[]) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'agenda@empresa.com',
                to: vendedor.Email,
                subject: ` Sua Agenda de Hoje - ${new Date().toLocaleDateString('pt-BR')}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">📅 Sua Agenda de Hoje</h2>
                        <p>Olá <strong>${vendedor.Nome_Col}</strong>,</p>
                        <p>Você tem <strong>${tarefas.length} tarefas</strong> agendadas para hoje:</p>
                        
                        ${tarefas.map(tarefa => `
                            <div style="background: #f0f9ff; padding: 12px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #0369a1;">
                                <h4 style="margin: 0; color: #0369a1;">${tarefa.Titulo}</h4>
                                <p><strong>🕐 Horário:</strong> ${new Date(tarefa.Data_Hora_Inicio).toLocaleString('pt-BR')}</p>
                                <p><strong> Descrição:</strong> ${tarefa.Descricao}</p>
                            </div>
                        `).join('')}
                        
                        <p style="color: #059669; font-weight: bold;">
                             Dica: Revise suas tarefas e prepare-se com antecedência!
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(` Resumo diário enviado para: ${vendedor.Email}`);

        } catch (error) {
            console.error(' Erro ao enviar resumo diário:', error);
        }
    }

    parar() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log(' Sistema de lembretes parado.');
        }
    }
}

export default LembreteObserver;