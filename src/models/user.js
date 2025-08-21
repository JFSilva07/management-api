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

//Function to update a user by ID
export const updateUser = (id, { name, email, password, number }) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE users SET name = ?, email = ?, password = ?, number = ? WHERE id = ?";
    db.query(sql, [name, email, password, number, id], (error, results) => {
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
