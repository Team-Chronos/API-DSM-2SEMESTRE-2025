import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
app.use(express.static("Views"));
app.use(express.static("models")) // serve o index.html
app.use(bodyParser.json());

// conexão com o banco MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // seu usuário do MySQL
  password: "fatec", // sua senha do MySQL
  database: "Api_2"
});

// rota de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).json({ mensagem: "Erro no servidor" });

      if (results.length > 0) {
        res.json({ mensagem: "Login realizado com sucesso!" });
      } else {
        res.json({ mensagem: "Email ou senha incorretos!" });
      }
    }
  );
});

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha, cpf, setor } = req.body;

  if (!nome || !email || !senha || !cpf || !setor) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    const [emailResults] = await db.promise().query("SELECT * FROM Colaboradores WHERE Email = ?", [email]);
    if (emailResults.length > 0) {
      return res.status(400).json({ mensagem: "Email já cadastrado!" });
    }

    const [cpfResults] = await db.promise().query("SELECT * FROM Colaboradores WHERE CPF = ?", [cpf]);
    if (cpfResults.length > 0) {
      return res.status(400).json({ mensagem: "CPF já cadastrado!" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const insertQuery = "INSERT INTO Colaboradores (Nome_Col, Email, Senha, CPF, Setor) VALUES (?, ?, ?, ?, ?)";
    await db.promise().query(insertQuery, [nome, email, senhaHash, cpf, setor]);

    res.json({ mensagem: "Usuário cadastrado com sucesso!" });

  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
});

// Rota de exclusão de colaborador
app.delete("/colaboradores/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Colaboradores WHERE ID_colaborador = ?", [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir colaborador:", err);
      return res.status(500).json({ mensagem: "Erro ao excluir colaborador." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Colaborador não encontrado." });
    }

    res.json({ mensagem: "Colaborador excluído com sucesso!" });
  });
});

app.get("/colaboradores", (req, res) => {
  db.query("SELECT * FROM Colaboradores", (err, results) => {
    if (err) {
      return res.status(500).json({ mensagem: "Erro ao buscar colaboradores." });
    }
    res.json(results);
  });
});
//notificar colaborador sobre eventos
app.post("/notificar-evento", async (req, res) => {
    const { idEvento, idColaborador, resposta, motivo } = req.body;

    try {
        const [eventoResults] = await db.promise().query(`
            SELECT e.*, c.Email as OrganizadorEmail, c.Nome_Col as OrganizadorNome 
            FROM Evento e 
            INNER JOIN Colaboradores c ON e.ID_Organizador = c.ID_colaborador 
            WHERE e.ID_Evento = ?
        `, [idEvento]);

        if (eventoResults.length === 0) {
            return res.status(404).json({ mensagem: "Evento não encontrado." });
        }

        const evento = eventoResults[0];

        //Buscar informações do colaborador
        const [colaboradorResults] = await db.promise().query(
            "SELECT Nome_Col FROM Colaboradores WHERE ID_colaborador = ?",
            [idColaborador]
        );

        if (colaboradorResults.length === 0) {
            return res.status(404).json({ mensagem: "Colaborador não encontrado." });
        }

        const colaborador = colaboradorResults[0];

        const queryParticipacao = `
            INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, Status, Motivo) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE Status = ?, Motivo = ?
        `;
        
        await db.promise().query(queryParticipacao, [
            idEvento, idColaborador, resposta, motivo,
            resposta, motivo
        ]);

        //Enviar email de notificação para o organizador
        const mailOptions = {
            from: process.env.EMAIL_USER || 'sistema@newe.com',
            to: evento.OrganizadorEmail,
            subject: `Resposta para o evento: ${evento.Nome_Evento}`,
            html: `
                <h2>Nova resposta para o evento: ${evento.Nome_Evento}</h2>
                <p><strong>Colaborador:</strong> ${colaborador.Nome_Col}</p>
                <p><strong>Resposta:</strong> ${resposta}</p>
                ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
                <p>Data do evento: ${new Date(evento.Data_Evento).toLocaleDateString('pt-BR')}</p>
                <p>Local: ${evento.Local_Evento}</p>
            `
        };

        // Enviar email 
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar notificação:', error);
                // Ainda assim retornamos sucesso
            } else {
                console.log('Notificação enviada:', info.response);
            }
        });

        res.json({ 
            mensagem: "Resposta registrada com sucesso e organizador notificado!",
            notificacaoEnviada: true
        });

    } catch (err) {
        console.error("Erro ao processar resposta do evento:", err);
        res.status(500).json({ mensagem: "Erro ao processar resposta." });
    }
});

// eventos.js
app.get("/eventos", (req, res) => {
    db.query("SELECT * FROM Evento", (err, results) => {
        if (err) {
            console.error("Erro ao buscar eventos:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar eventos." });
        }
        res.json(results);
    });
});

// inicia servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
