import mysql from "mysql2";
import { env } from "./env.js";

const db = mysql.createConnection({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database successfully!");
});
export default db;

// This code establishes a connection to a MySQL database using the mysql2 package.
// It specifies the host, user, password, database name, and port.
// If the connection is successful, it logs a success message; otherwise, it logs an error message.
// The connection is exported for use in other parts of the application.
