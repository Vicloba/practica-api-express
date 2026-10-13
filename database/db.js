require('dotenv').config(); // <-- Esta línea DEBE ir al inicio absoluto del archivo
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'api_practica',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado exitosamente a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
  }
}


testConnection();

// Exportamos el pool para poder ejecutar consultas SQL en otros archivos
module.exports = pool;