//validate recebe um schema do Joi e devolve um middleware do Express.
export const validate = (schema) => (req, res, next) => {
  //Valida o corpo da requisição conforme o schema.
  //abortEarly: false faz o Joi acumular todos os erros em vez de parar no primeiro,permitindo retornar uma lista completa para o cliente.
  //O retorno tem { value, error, warning }; aqui você só usa error.
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Erro de validação",
      //error.details é um array com cada falha de validação.
      errors: error.details.map((err) => ({
        field: err.path.join("."),
        //err.message é a mensagem gerada pelo Joi (pode ser customizada no schema em .messages()).
        message: err.message,
      })),
    });
  }
  //Só é executado se não houver erro, liberando o fluxo para o próximo middleware
  next();
};
