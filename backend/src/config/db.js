import mysql from 'mysql2';


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rafa",
  database: "Api_2"
});


export default db;