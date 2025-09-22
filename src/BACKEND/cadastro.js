const transporter = require('./mailer'); 
require('dotenv').config();

function enviarEmailConfirmacao(destinatario) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: 'Confirmação de Cadastro',
    text: 'Olá! Seu cadastro foi confirmado com sucesso.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
    } else {
      console.log('E-mail enviado com sucesso:', info.response);
    }
  });
}


enviarEmailConfirmacao('email@exemplo.com');
