import { Router } from "express";
import { alunosRoutes } from "./alunos-routes";
import { professorRoutes } from "./professores-routes";
import { oficinaRoutes } from "./oficina-routes";
import { authRoutes } from "./auth-routes";  
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const routes = Router();

routes.use("/auth", authRoutes);

// Rotas protegidas
routes.use("/professores", professorRoutes);
routes.use("/alunos", alunosRoutes);
routes.use("/oficinas", oficinaRoutes);

export { routes };