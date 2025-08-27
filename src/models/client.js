import db from "../config/db.js";

// 🔹 Função para buscar todos os clientes
export const getAllClients = async () => {
  const [rows] = await db.query("SELECT * FROM clients");
  return rows;
};

// 🔹 Função para buscar um cliente por ID
export const getClientById = async (id) => {
  const [rows] = await db.query("SELECT * FROM clients WHERE id = ?", [id]);
  return rows[0];
};

// 🔹 Função para criar um novo cliente
export const createClient = async ({ name, email, number, address, cpf }) => {
  const sql =
    "INSERT INTO clients (name, email, number, cpf, address) VALUES (?, ?, ?, ?, ?)";

  const values = [name, email, number, cpf, JSON.stringify(address)];

  const [result] = await db.query(sql, values);
  return result.insertId;
};

// 🔹 Função para atualizar um cliente por ID
export const updateClient = async (id, { email, number, address }) => {
  const fields = [];
  const values = [];

  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }
  if (number !== undefined) {
    fields.push("number = ?");
    values.push(number);
  }
  if (address !== undefined) {
    fields.push("address = ?");
    values.push(JSON.stringify(address));
  }

  if (fields.length === 0) return 0;

  const sql = `UPDATE clients SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  const [result] = await db.query(sql, values);
  return result.affectedRows;
};

// 🔹 Função para deletar um cliente por ID
export const deleteClient = async (id) => {
  const [result] = await db.query("DELETE FROM clients WHERE id = ?", [id]);
  return result.affectedRows;
};
