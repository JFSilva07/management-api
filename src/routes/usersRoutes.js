import express from "express";
import { userSchema, userUpdateSchema } from "../validations/userSchema.js";
import { validate } from "../middlewares/validate.js";

// Importa funções que contém as queries SQL
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../models/user.js";

const router = express.Router();

// Rota para buscar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID de usuário inválido. Deve ser um número." });
    }

    const user = await getUserById(id);
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para criar novo usuário
router.post("/", validate(userSchema), async (req, res) => {
  try {
    const { name, email, password, number } = req.body;
    const newUserId = await createUser({ name, email, password, number });
    res.status(201).json({
      message: "Usuário criado com sucesso!",
      userId: newUserId,
    });
  } catch (error) {
    console.error("Erro ao inserir novo usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para atualizar usuário pelo ID
router.put("/:id", validate(userUpdateSchema), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID de usuário inválido. Deve ser um número." });
    }

    const affectedRows = await updateUser(id, req.body);

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado ou nada para atualizar." });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para deletar usuário pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID de usuário inválido. Deve ser um número." });
    }

    const affectedRows = await deleteUser(id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
