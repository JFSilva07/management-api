import db from "../config/db.js";

//Todos os dados já estão validados na rota antes de chegar aqui.

// Função pra buscar todos os produtos
export const GetAllProducts = async (onlyAvailable = false) => {
  const sql = onlyAvailable
    ? "SELECT * FROM products WHERE in_stock = 1"
    : "SELECT * FROM products";
  const [rows] = await db.query(sql);
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
  // Filtra apenas os campos que não são undefined
  const keys = Object.keys(fields).filter((key) => fields[key] !== undefined);
  if (keys.length === 0) return 0;

  const values = keys.map((key) => fields[key]);

  // Ajusta in_stock se o estoque foi enviado
  if ("storage" in fields) {
    const in_stock = fields.storage > 0 ? 1 : 0;
    keys.push("in_stock");
    values.push(in_stock);
  }

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
