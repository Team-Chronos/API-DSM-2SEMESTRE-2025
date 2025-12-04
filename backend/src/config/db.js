import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql. createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console. error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco de dados MySQL!");
  }
});

export default db;