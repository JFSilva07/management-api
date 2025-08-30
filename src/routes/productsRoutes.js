import express from "express";
const router = express.Router();
//midleware de validação
import { validate } from "../middlewares/validate.js";
//schemas de validação
import {
  productSchema,
  productUpdateSchema,
} from "../validations/productsSchema.js";

//funções do model com as queries SQL
import {
  GetAllProducts,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
} from "../models/product.js";

//Rota para buscar todos os produtos
router.get("/", async (req, res) => {
  try {
    const onlyAvailable = req.query.available === "true";
    const products = await GetAllProducts(onlyAvailable);
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Rota para buscar produto por ID, com validação de ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const product = await GetProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar os cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

//Rota para criar um produto
router.post("/", validate(productSchema), async (req, res) => {
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

//Rota para atualizar produto por ID (todos os campos opcionais)
router.put("/:id", validate(productUpdateSchema), async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const { name, price, description, category, storage } = req.body;
    const affectedRows = await UpdateProduct(id, {
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

//Rota para deletar produto por ID, com validação de ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  try {
    const affectedRows = await DeleteProduct(id);

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
