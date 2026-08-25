const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Cria o pool de conexões com o banco MySQL.
 * Usa SSL automaticamente quando DB_SSL=true (necessário para bancos em nuvem como o Aiven).
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

module.exports = pool;  