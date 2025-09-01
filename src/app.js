import express from "express";
import professorRoutes from "./routes/professorRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/professores", professorRoutes);
app.use("/usuarios", usuarioRoutes);

export default app;