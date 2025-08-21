import express from "express";
import userRoutes from "./routes/usersRoutes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";

const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());

//Uso das rotas
app.use("/users", userRoutes);
app.use("/clients", clientsRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);

export default app;
