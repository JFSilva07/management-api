import Joi from "joi";

// Lista de categorias válidas (você pode ajustar)
const categories = [
  "eletrônicos",
  "celulares",
  "informática",
  "eletrodomésticos",
  "outros",
];
//Validação para criação de produto
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(150).required().messages({
    "string.base": "O nome do produto deve ser um texto.",
    "string.empty": "O nome do produto é obrigatório.",
    "string.min": "O nome do produto deve ter no mínimo {#limit} caracteres.",
    "string.max": "O nome do produto deve ter no máximo {#limit} caracteres.",
    "any.required": "O nome do produto é obrigatório.",
  }),
  price: Joi.number().precision(2).positive().required().messages({
    "number.base": "O preço deve ser um número.",
    "number.positive": "O preço deve ser maior que zero.",
    "number.precision": "O preço deve ter no máximo 2 casas decimais.",
    "any.required": "O preço do produto é obrigatório.",
  }),
  description: Joi.string()
    .max(500)
    .allow("") // permite descrição vazia
    .messages({
      "string.base": "A descrição deve ser um texto.",
      "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
    }),
  category: Joi.string()
    .valid(...categories)
    .required()
    .messages({
      "any.only": `Categoria inválida. Deve ser uma das seguintes: ${categories.join(
        ", "
      )}`,
      "any.required": "A categoria do produto é obrigatória.",
    }),
  storage: Joi.number().integer().min(0).required().messages({
    "number.base": "O estoque deve ser um número inteiro.",
    "number.integer": "O estoque deve ser um número inteiro.",
    "number.min": "O estoque não pode ser negativo.",
    "any.required": "O estoque é obrigatório.",
  }),
});

// Schema para atualização parcial de produto (todos os campos opcionais)
export const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(150).messages({
    "string.base": "O nome do produto deve ser um texto.",
    "string.min": "O nome do produto deve ter no mínimo {#limit} caracteres.",
    "string.max": "O nome do produto deve ter no máximo {#limit} caracteres.",
  }),
  price: Joi.number().precision(2).positive().messages({
    "number.base": "O preço deve ser um número.",
    "number.positive": "O preço deve ser maior que zero.",
    "number.precision": "O preço deve ter no máximo 2 casas decimais.",
  }),
  description: Joi.string().max(500).messages({
    "string.base": "A descrição deve ser um texto.",
    "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
  }),
  category: Joi.string()
    .valid(...categories)
    .messages({
      "any.only": `Categoria inválida. Deve ser uma das seguintes: ${categories.join(
        ", "
      )}`,
    }),
  storage: Joi.number().integer().min(0).messages({
    "number.base": "O estoque deve ser um número inteiro.",
    "number.integer": "O estoque deve ser um número inteiro.",
    "number.min": "O estoque não pode ser negativo.",
  }),
});
