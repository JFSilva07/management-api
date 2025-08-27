import express from "express";
import { validate, validateClientData } from "../middlewares/validate.js";
import { updateClientSchema } from "../validations/clientSchema.js";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../models/client.js";

const router = express.Router();

// GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// GET client by ID
router.get("/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const { id } = req.params;
    const client = await getClientById(id);
    if (!client)
      return res.status(404).json({ error: "Cliente não encontrado" });
    res.status(200).json(client);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// POST create client
router.post("/", validateClientData, async (req, res) => {
  try {
    const { name, email, number, address, cpf } = req.body;
    const newClientId = await createClient({
      name,
      email,
      number,
      address,
      cpf,
    });
    res
      .status(201)
      .json({ message: "Cliente criado com sucesso!", ClientId: newClientId });
  } catch (error) {
    console.error("Erro ao inserir novo cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// PUT update client by ID
router.put("/:id", validate(updateClientSchema), async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const { id } = req.params;
    const updates = {};
    ["email", "number", "address"].forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const affectedRows = await updateClient(id, updates);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Cliente não encontrado" });

    res.status(200).json({ message: "Cliente atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar Cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE client by ID
router.delete("/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const { id } = req.params;
    const affectedRows = await deleteClient(id);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Cliente não encontrado" });

    res.status(200).json({ message: "Cliente deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
