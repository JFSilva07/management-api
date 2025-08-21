import express from "express";
const router = express.Router();

import {
  GetAllProducts,
  GetProductById,
  CreateProduct,
  updateProduct,
  deleteProduct,
} from "../models/product.js";

//Route to fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await GetAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Route to fecth product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await GetProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar os cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Route to create a product.
router.post("/", async (req, res) => {
  try {
    const { name, price, description, category, storage } = req.body;
    const newProduct = await CreateProduct({
      name,
      price,
      description,
      category,
      storage,
    });
    res.status(201).json({
      message: "Produto criado com sucesso!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Erro ao inserir novo produto:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Route to Update product by ID.
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, storage } = req.body;
    const affectedRows = await updateProduct(id, {
      name,
      price,
      description,
      category,
      storage,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Protudo não encontrado" });
    }

    res.status(200).json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto.:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Route to delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteProduct(id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
