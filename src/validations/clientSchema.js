import Joi from "joi";
import axios from "axios";

// Função para validar CPF
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0,
    rest;

  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[10])) return false;

  return true;
}

// Função para validar CEP via API
export async function cepExists(cep) {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    const response = await axios.get(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );
    return !response.data.erro;
  } catch (err) {
    return false;
  }
}

// Schema do endereço
export const addressSchema = Joi.object({
  street: Joi.string().min(3).max(150).required(),
  number: Joi.string().max(20).required(),
  neighborhood: Joi.string().max(100).required(),
  city: Joi.string().max(100).required(),
  state: Joi.string().length(2).uppercase().required(),
  country: Joi.string().max(100).required(),
  cep: Joi.string()
    .pattern(/^\d{5}-?\d{3}$/)
    .required(),
});

// Schema do cliente
export const clientSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "br"] } })
    .required(),
  number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required(),
  cpf: Joi.string()
    .custom((value, helpers) => {
      if (!isValidCPF(value)) return helpers.error("any.invalid");
      return value;
    })
    .required()
    .messages({ "any.invalid": "CPF inválido" }),
  address: addressSchema.required(),
});

//schema para atualização (PUT)
export const updateClientSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "br"] } })
    .messages({ "string.email": "O e-mail deve ser válido." }),
  number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": "O número deve conter 11 dígitos.",
    }),
  address: Joi.object({
    street: Joi.string().min(3).max(150),
    number: Joi.string().max(20),
    neighborhood: Joi.string().max(100),
    city: Joi.string().max(100),
    state: Joi.string().length(2).uppercase(),
    country: Joi.string().max(100),
    cep: Joi.string().pattern(/^\d{5}-?\d{3}$/),
  }),
}).min(1); // pelo menos um campo deve ser enviado
