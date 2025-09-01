import { Router } from "express";
import { professorRoutes } from "./professores-routes";

const routes = Router();

routes.use("/professores", professorRoutes);

export { routes };