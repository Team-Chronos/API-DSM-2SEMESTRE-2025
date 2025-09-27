import jwt from 'jsonwebtoken';
import transporter from '../mailer.js';  

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [results] = await Colaborador.findByEmail(email);

    if (results.length === 0) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos!" });
    }

    const usuario = results[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos!" });
    }

    const payload = { id: usuario.ID_colaborador, nome: usuario.Nome_Col, setor: usuario.Setor };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', { expiresIn: '8h' });

    res.json({ mensagem: "Login realizado com sucesso!", token: token });

  } catch (err) {
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
};

export const enviarEmailConfirmacao = async (email, nome) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmação de Cadastro",
      html: `<p>Olá, ${nome}! Seu cadastro foi realizado com sucesso.</p>`
    });
    console.log(`Email de confirmação enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
};
