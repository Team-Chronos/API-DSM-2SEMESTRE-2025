import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "TusckAct4$",
  database: "Api_2"
});

export default db;