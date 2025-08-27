import db from "../config/db.js";

//Todos os dados já estão validados na rota antes de chegar aqui.

// Função pra buscar todos os produtos
export const GetAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
  return rows;
};

// Função pra buscar produto por ID
export const GetProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

// Função pra criar novo produto
export const CreateProduct = async ({
  name,
  price,
  description,
  category,
  storage,
}) => {
  const [result] = await db.query(
    "INSERT INTO products (name, price, description, category, storage) VALUES (?, ?, ?, ?, ?)",
    [name, price, description, category, storage]
  );
  return result.insertId;
};

// Função pra atualizar produto por ID (aceita campos opcionais)
export const UpdateProduct = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return 0;

  const values = keys.map((key) => fields[key]);
  const setString = keys.map((key) => `${key} = ?`).join(", ");

  const [result] = await db.query(
    `UPDATE products SET ${setString} WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows;
};

// Função pra deletar produto por ID
export const DeleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};
