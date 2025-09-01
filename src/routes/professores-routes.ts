import { Router } from "express";
import { ProfessorControllers } from "@/controllers/professores-controller";

const professorRoutes = Router();
const professorControllers = new ProfessorControllers();

professorRoutes.get("/", professorControllers.index.bind(professorControllers));

export { professorRoutes };