import mysql from "mysql2/promise";
import { env } from "./env.js";

// Cria um pool de conexões
const db = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Conexão com o banco de dados funcionando!");
  } catch (err) {
    console.error("❌ Erro ao conectar com o banco de dados:", err);
  }
};

// Executa o teste imediatamente ao importar
testConnection();

export default db;
