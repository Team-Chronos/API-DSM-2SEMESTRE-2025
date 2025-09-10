import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

const app = express();
app.use(express.static("public")); // serve o index.html
app.use(bodyParser.json());

// conexão com o banco MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // seu usuário do MySQL
  password: "", // sua senha do MySQL
  database: "Api_2"
});

// rota de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ mensagem: "Erro no servidor" });
    if (results.length === 0) return res.json({ mensagem: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha); // compara senha criptografada

    if (senhaCorreta) {
      res.json({ mensagem: "Login realizado com sucesso!" });
    } else {
      res.json({ mensagem: "Senha incorreta!" });
    }
  });
});

// inicia servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
