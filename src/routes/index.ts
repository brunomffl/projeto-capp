import { Router } from "express";
import { alunosRoutes } from "./alunos-routes";
import { professorRoutes } from "./professores-routes";
import { oficinaRoutes } from "./oficina-routes";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const routes = Router();

//rotas protegidas
//routes.use(ensureAuthenticated);
routes.use("/professores", professorRoutes);
routes.use("/alunos", alunosRoutes);
routes.use("/oficinas", oficinaRoutes);

export { routes };
