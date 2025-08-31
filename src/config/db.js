import mysql from "mysql2/promise";
import { env } from "./env.js";

let db;

if (process.env.DATABASE_URL) {
  // Conexão TiDB/PlanetScale
  const url = new URL(process.env.DATABASE_URL);

  db = mysql.createPool({
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: decodeURIComponent(url.password), // decodifica caracteres especiais
    database: url.pathname.replace("/", ""), // remove a barra inicial
    ssl: { rejectUnauthorized: true }, // configuração de SSL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("⚡ Conectado ao banco na nuvem (TiDB/PlanetScale)");
} else {
  // MySQL local
  db = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.pass,
    database: env.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("⚡ Conectado ao MySQL local");
}

// Teste de conexão
const testConnection = async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Banco conectado com sucesso!", rows);
  } catch (err) {
    console.error("❌ Erro ao conectar com o banco:", err);
  }
};

testConnection();

export default db;
