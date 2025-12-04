import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "fatec",
  database: process.env.DB_NAME || "api_2",
  port: process.env.DB_PORT || 3306
});

export default db;
