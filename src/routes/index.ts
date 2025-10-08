import { Router } from "express";
import { alunosRoutes } from "./alunos-routes";
import { professorRoutes } from "./professores-routes";
import { oficinaRoutes } from "./oficina-routes";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";

const routes = Router();

//rotas protegidas
routes.use(ensureAuthenticated);
routes.use("/professores", verifyUserAuthorization(["admin"]),professorRoutes);
routes.use("/alunos", alunosRoutes);
routes.use("/oficinas", verifyUserAuthorization(["admin"]), oficinaRoutes);

export { routes };
