import express from "express";
//Helps to create routes in a modular and organized way
const router = express.Router();

//Import the functions that contain the SQL queries
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../models/client.js";

//Route to fetch all clients
router.get("/", async (req, res) => {
  try {
    const clients = await getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Route to fetch a client by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getClientById(id);
    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Route to create a new client
router.post("/", async (req, res) => {
  try {
    const { name, email, number, adress, cpf } = req.body;
    // Adicionar validação de dados aqui, se necessário
    const newClientId = await createClient({
      name,
      email,
      number,
      adress,
      cpf,
    });
    res.status(201).json({
      message: "Cliente criado com sucesso!",
      ClientId: newClientId,
    });
  } catch (error) {
    console.error("Erro ao inserir novo cliente :", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Route to update a client by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, number, adress } = req.body;
    const affectedRows = await updateClient(id, {
      email,
      number,
      adress,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.status(200).json({ message: "Cliente atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar Cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Route to delete a client by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteClient(id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.status(200).json({ message: "Cliente deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
// Export the router to be used in the main app
export default router;
