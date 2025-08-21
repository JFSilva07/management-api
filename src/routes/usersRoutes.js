import express from "express";

//importa as funções que contém as querys SQL
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../models/user.js";

//Ajuda a criar rotas de forma modular e organizada.
const router = express.Router();

//Rota pra puxar todos os usuários
router.get("/", async (req, res) => {
  try {
    //Espera o resultado da função
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Route to fetch a user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID de usuário inválido. O ID deve ser um número." });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Route to create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, number } = req.body;
    // Adicionar validação de dados aqui, se necessário
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

// Route to update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, number } = req.body;
    const affectedRows = await updateUser(id, {
      name,
      email,
      password,
      number,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Route to delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteUser(id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Export the router to be used in the main app
export default router;
