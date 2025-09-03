import { Router } from "express";
import { professorRoutes } from "./professores-routes";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const routes = Router();

//rotas públicas
// - login -

//rotas protegidas
routes.use(ensureAuthenticated);
routes.use("/professores", professorRoutes);

export { routes };