import db from './config/db.js';
import transporter from './mailer.js';

const verificarNovosEventos = async () => {
    try {
        const [results] = await db.promise().query(`
            SELECT e.* 
            FROM Evento e 
            LEFT JOIN sistema_eventos_notificados sen ON e.ID_Evento = sen.ID_Evento
            WHERE sen.ID_Evento IS NULL 
            ORDER BY e.Data_Evento DESC 
            LIMIT 5
        `);

        for (const evento of results) {
            console.log(' Detectado novo evento:', evento.Nome_Evento);

            const notificacaoEnviada = await enviarNotificacaoEvento(evento);

            if (notificacaoEnviada) {
                await db.promise().query(`
                    INSERT INTO sistema_eventos_notificados (ID_Evento, notificacao_enviada, data_notificacao) 
                    VALUES (?, TRUE, NOW())
                `, [evento.ID_Evento]);

                console.log(' Notificações enviadas para o evento:', evento.Nome_Evento);
            }
        }
    } catch (error) {
        console.error(' Erro no observador de eventos:', error);
    }
};

const enviarNotificacaoEvento = async (evento) => {
    try {
        const [colaboradores] = await db.promise().query(`
            SELECT c.*, s.Nome_Setor 
            FROM Colaboradores c 
            LEFT JOIN Setor s ON c.Setor = s.ID_Setor 
            WHERE c.Email IS NOT NULL AND c.Email != ''
        `);

        for (const colaborador of colaboradores) {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'eventos@newelog.com',
                to: colaborador.Email,
                subject: ` Novo Evento: ${evento.Nome_Evento}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Newe Log</h1>
                            <p style="margin: 5px 0 0 0;">Novo Evento Agendado</p>
                        </div>
                        
                        <div style="padding: 20px;">
                            <h2 style="color: #333;">Olá, ${colaborador.Nome_Col}! </h2>
                            <p>Um novo evento foi agendado e sua presença é importante!</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #495057; margin-top: 0;"> Detalhes do Evento</h3>
                                <p><strong>Evento:</strong> ${evento.Nome_Evento}</p>
                                <p><strong>Data:</strong> ${new Date(evento.Data_Evento).toLocaleString('pt-BR')}</p>
                                <p><strong>Local:</strong> ${evento.Local_Evento}</p>
                                <p><strong>Descrição:</strong> ${evento.Descricao}</p>
                            </div>
                            
                            <p><strong>Por favor, confirme sua presença:</strong></p>
                            
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="http://localhost:3000/confirmarEvento.html?eventoId=${evento.ID_Evento}" 
                                   style="background: #28a745; color: white; padding: 12px 24px; 
                                          text-decoration: none; border-radius: 5px; font-size: 16px;
                                          display: inline-block; font-weight: bold;">
                                     Confirmar Presença
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #dee2e6; margin-top: 25px; padding-top: 15px;">
                                <p style="color: #6c757d; font-size: 12px;">
                                    Este é um aviso automático. Por favor, não responda este email.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Notificação enviada para:', colaborador.Email);
        }

        return true;
    } catch (error) {
        console.error(' Erro ao enviar notificações do evento:', error);
        return false;
    }
};

const criarTabelaEventosControle = async () => {
    try {
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS sistema_eventos_notificados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ID_Evento INT NOT NULL,
                notificacao_enviada BOOLEAN DEFAULT FALSE,
                data_notificacao DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_evento (ID_Evento),
                FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento)
            )
        `);
        console.log(' Tabela de controle de eventos verificada/criada');
    } catch (error) {
        console.log('  Tabela de eventos já existe ou erro ignorável', error);
    }
};

const iniciarObservadorEventos = async () => {
    await criarTabelaEventosControle();
    
    await verificarNovosEventos();
    
    setInterval(verificarNovosEventos, 60000);
    
    console.log(' Observador de eventos INICIADO');
};

export default iniciarObservadorEventos;
