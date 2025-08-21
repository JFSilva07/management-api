import db from "../config/db.js";

//Function to fetch all products.
export const GetAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//Function to fecth product by ID.
export const GetProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM products WHERE id=?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//Function to create new product.
export const CreateProduct = ({
  name,
  price,
  description,
  category,
  storage,
}) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO products (name, price , description, category, storage) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [name, price, description, category, storage],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      }
    );
  });
};

//Function to update product by ID.
export const updateProduct = (
  id,
  { name, price, description, category, storage }
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE products SET name = ?, price = ?, description = ?, category = ?, storage= ? WHERE id = ?";
    db.query(
      sql,
      [name, price, description, category, storage, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.affectedRows);
      }
    );
  });
};

//Function to delete product by ID. deleteProduct

export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.affectedRows);
    });
  });
};
