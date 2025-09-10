import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";

const app = express();
app.use(express.static("view")); // serve o index.html
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

// inicia servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
