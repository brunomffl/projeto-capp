import { Router } from "express";
import { ProfessorControllers } from "@/controllers/professores-controller";
import { validateBody } from "@/middleware/ValidateSchema";
import { createProfessorSchema } from "@/schemas/professor-schema";

const professorRoutes = Router();
const professorControllers = new ProfessorControllers();

professorRoutes.get("/", professorControllers.index.bind(professorControllers));
professorRoutes.post("/", validateBody(createProfessorSchema),professorControllers.create.bind(professorControllers));

export { professorRoutes };