import app from "./app.js";
import { env } from "./config/env.js";
const PORT = env.port || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});
