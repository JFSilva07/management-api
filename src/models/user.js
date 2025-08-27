import db from "../config/db.js";

// Buscar todos os usuários
export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

// Buscar usuário por ID
export const getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

// Criar usuário
export const createUser = async ({ name, email, password, number }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, number) VALUES (?, ?, ?, ?)",
    [name, email, password, number]
  );
  return result.insertId;
};

// Atualizar usuário
export const updateUser = async (id, fields) => {
  // Cria dinamicamente SET conforme os campos enviados
  const keys = Object.keys(fields);
  if (keys.length === 0) return 0;

  const values = keys.map((key) => fields[key]);
  const setString = keys.map((key) => `${key} = ?`).join(", ");

  const [result] = await db.query(
    `UPDATE users SET ${setString} WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows;
};

// Deletar usuário
export const deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
};
