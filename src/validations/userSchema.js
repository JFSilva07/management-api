// Schema de validação dos dados.
import Joi from "joi";

//Criação de usuários. Campos obrigatórios
export const userSchema = Joi.object({
  //Campo name é uma string, deve ter no min 3 caracteres, maximo de 30, é obrigatório.
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "O nome deve ser um texto.",
    "string.empty": "O nome é obrigatório.",
    "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
    "string.max": "O nome deve ter no máximo {#limit} caracteres.",
    "any.required": "O nome é obrigatório.",
  }),
  // Email é uma string e Joi valida se o formato é compativel com um email, obrigatório.
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "br"] } })
    .required()
    .messages({
      "string.email": "O e-mail deve ser válido.",
      "any.required": "O e-mail é obrigatório.",
    }),

  //passoword é uma string, minimo de 8 caracteres, máximo de 20, .patern valida a string de acordo com o regex passado, obrigatório.
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,30}$"
      )
    )
    .required()
    .messages({
      "string.empty": "A senha é obrigatória.",
      "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
      "string.max": "A senha deve ter no máximo {#limit} caracteres.",
      "string.pattern.base":
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@, $, !, %, *, ?, & ou #).",
      "any.required": "A senha é obrigatória.",
    }),

  number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required()
    .messages({
      "string.pattern.base":
        "O número deve conter apenas dígitos e ter 11 caracteres. Ex: 82 99999-9999.",
      "any.required": "O número é obrigatório.",
    }),
});

// Schema para atualização (todos opcionais)
export const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),

  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "br"] } })
    .optional()
    .messages({
      "string.email": "O e-mail deve ser válido.",
      "any.required": "O e-mail é obrigatório.",
    }),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,30}$"
      )
    )
    .optional()
    .messages({
      "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
      "string.max": "A senha deve ter no máximo {#limit} caracteres.",
      "string.pattern.base":
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@, $, !, %, *, ?, & ou #).",
    }),

  number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "O número deve conter apenas dígitos e ter 11 caracteres. Ex: 82 99999-9999.",
      "any.required": "O número é obrigatório.",
    }),
}).min(1); // <- garante que pelo menos um campo seja enviado
