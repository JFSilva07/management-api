import { clientSchema, cepExists } from "../validations/clientSchema.js";
import db from "../config/db.js";

// Middleware genérico para qualquer schema
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação",
      errors: error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
  next();
};

// Middleware unificado para criação de cliente
export const validateClientData = async (req, res, next) => {
  try {
    // 1️⃣ Validar schema completo
    await clientSchema.validateAsync(req.body, { abortEarly: false });

    // 2️⃣ Verificar CPF duplicado
    const [rows] = await db.query("SELECT id FROM clients WHERE cpf = ?", [
      req.body.cpf,
    ]);
    if (rows.length > 0)
      return res.status(400).json({ error: "CPF já cadastrado." });

    // 3️⃣ Validar CEP via API
    const isValidCep = await cepExists(req.body.address.cep);
    if (!isValidCep)
      return res.status(400).json({ error: "CEP não encontrado." });

    next();
  } catch (err) {
    return res.status(400).json({
      error: err.details ? err.details.map((e) => e.message) : err.message,
    });
  }
};
