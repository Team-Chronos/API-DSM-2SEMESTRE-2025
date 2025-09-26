import transporter from '../mailer.js';
import Evento from '../models/Eventos.js';

const enviarNotificacaoEvento = async (evento, destinatarios) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        subject: `Novo Evento: ${evento.titulo}`,
        html: `
            <h2>Novo Evento Agendado</h2>
            <h3>${evento.titulo}</h3>
            <p><strong>Descrição:</strong> ${evento.descricao}</p>
            <p><strong>Data:</strong> ${new Date(evento.data_evento).toLocaleDateString('pt-BR')}</p>
            <p><strong>Local:</strong> ${evento.local}</p>
            <br>
            <p>Por favor, confirme sua presença no sistema.</p>
            <a href="http://localhost:3000/confirmarEvento.html">Confirmar Presença</a>
        `
    };

    try {
        for (const destinatario of destinatarios) {
            mailOptions.to = destinatario.Email;
            mailOptions.html = mailOptions.html.replace('</h2>', `</h2><p>Olá ${destinatario.Nome_Col},</p>`);
            
            await transporter.sendMail(mailOptions);
            console.log('Notificação enviada para:', destinatario.Email);
        }
    } catch (error) {
        console.error('Erro ao enviar notificações:', error);
    }
};

export const criarEvento = async (req, res) => {
    const { titulo, descricao, data_evento, local, setores_notificar } = req.body;
    const criado_por = req.user.id;

    if (!titulo || !descricao || !data_evento || !local) {
        return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios!" });
    }

    try {
        const [result] = await Evento.create({ titulo, descricao, data_evento, local, criado_por });
        const eventoId = result.insertId;

        const [eventoResults] = await Evento.findById(eventoId);
        const evento = eventoResults[0];

        let destinatarios = [];

        if (setores_notificar && setores_notificar.length > 0) {
            for (const setor of setores_notificar) {
                const [colaboradoresSetor] = await Evento.findBySetor(setor);
                destinatarios = [...destinatarios, ...colaboradoresSetor];
            }
        } else {
            const [todosColaboradores] = await Evento.findAllColaboradores();
            destinatarios = todosColaboradores;
        }

        enviarNotificacaoEvento(evento, destinatarios);

        res.status(201).json({ 
            mensagem: "Evento criado com sucesso! Notificações estão sendo enviadas.",
            evento: evento,
            destinatarios: destinatarios.length
        });

    } catch (err) {
        console.error('Erro ao criar evento:', err);
        res.status(500).json({ mensagem: "Erro ao criar evento" });
    }
};

export const listarEventos = async (req, res) => {
    try {
        const [results] = await Evento.findAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar eventos." });
    }
};

export const obterEventoPorId = async (req, res) => {
    try {
        const [results] = await Evento.findById(req.params.id);
        if (results.length === 0) return res.status(404).json({ mensagem: "Evento não encontrado." });
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar evento." });
    }
};