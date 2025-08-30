import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../models/sales.js";

const router = express.Router();

// Route to Create new sale
router.post("/", async (req, res) => {
  try {
    const { client_id, user_id, items } = req.body;

    if (!client_id) {
      return res.status(400).json({ error: "O campo client_id é obrigatório" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "O campo user_id é obrigatório" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "A venda precisa ter ao menos um produto" });
    }

    const sale = await createSale(client_id, user_id, items);

    res.status(201).json({ message: "Venda criada com sucesso!", sale });
  } catch (error) {
    console.error("Erro ao criar venda:", error);

    // Captura erro de estoque insuficiente
    if (error.message.startsWith("Estoque insuficiente")) {
      return res.status(400).json({ error: error.message });
    }

    // Captura erro de produto não encontrado
    if (error.message.startsWith("Produto")) {
      return res.status(400).json({ error: error.message });
    }

    // Outros erros
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Read All Sales
router.get("/", async (req, res) => {
  try {
    const sales = await getSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Read Sale by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await getSaleById(id);

    if (!sale) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Update Sale
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "A venda precisa ter ao menos um produto" });
    }

    const result = await updateSale(id, items);

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao atualizar venda:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Delete Sale
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteSale(id);

    if (!result.deleted) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    res.status(200).json({ message: "Venda excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
