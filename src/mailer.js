import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔧 Configurando email...');
console.log('Host:', process.env.EMAIL_HOST);
console.log('Usuário:', process.env.EMAIL_USER);

const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailUser = process.env.EMAIL_USER || 'seuemail@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'suasenhaapp';

console.log('Host configurado:', emailHost);
console.log('Usuário configurado:', emailUser);

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Erro detalhado:', error.message);
    
    console.log('Ativando modo desenvolvimento - emails simulados');
  } else {
    console.log('Email configurado com sucesso!');
  }
});

export default transporter;