import db from "../config/db.js";

//Function to fetch all clients
export const getAllClients = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM clients";
    db.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//Function to fetch a clients by ID
export const getClientById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM clients WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
};

//Function to create a new client
export const createClient = ({ name, email, number, adress, cpf }) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO clients (name, email , number, adress, cpf) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, number, adress, cpf], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

//Function to update a client by ID
export const updateClient = (id, { email, number, adress }) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE clients SET email = ?, number = ?, adress = ? WHERE id = ?";
    db.query(sql, [email, number, adress, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.affectedRows);
    });
  });
};

//Function to delete a client by ID
export const deleteClient = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM clients WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.affectedRows);
    });
  });
};
