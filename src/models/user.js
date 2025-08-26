import db from "../config/db.js";

//Function to fetch all users
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//Function to fetch a user by ID
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
};

//Function to create a new user
export const createUser = ({ name, email, password, number }) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users (name, email, password, number) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, number], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

//Função para atualizar um usuário pelo ID.
export const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    // Remove campos nulos, vazios ou undefined
    const fields = Object.entries(data).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    );

    if (fields.length === 0) {
      return resolve(0); // nenhum campo para atualizar
    }

    // Monta dinamicamente a query
    const setClause = fields.map(([key]) => `${key} = ?`).join(", ");
    const values = fields.map(([_, value]) => value);

    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

    db.query(sql, [...values, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.affectedRows);
    });
  });
};

//Function to delete a user by ID
export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.affectedRows);
    });
  });
};
