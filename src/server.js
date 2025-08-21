import app from "./app.js";
import { env } from "./config/env.js";
const PORT = env.port || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  }
  console.log(`Server is running on port ${PORT}`);
});
