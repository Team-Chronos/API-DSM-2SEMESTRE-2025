import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'apichronos7@gmail.com',
    pass: 'nzezyueknlnwvjvo' 
  },
  debug: false,
  logger: false
});

console.log('Inicializando sistema de email...');


transporter.verify()
  .then(() => {
    console.log(' CONEXÃO COM GMAIL BEM-SUCEDIDA!');
    console.log(' Sistema de notificações OPERACIONAL!');
  })
  .catch(error => {
    console.error(' Falha na autenticação:', error.message);
  });

export default transporter;