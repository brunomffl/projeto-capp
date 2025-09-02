import { Router } from "express";
import { ProfessorControllers } from "@/controllers/professores-controller";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { createProfessorSchema, deleteProfessorSchema, updateProfessorSchema } from "@/schemas/professor-schema";

const professorRoutes = Router();
const professorControllers = new ProfessorControllers();

professorRoutes.get("/", professorControllers.index.bind(professorControllers));
professorRoutes.post("/", validateBody(createProfessorSchema),professorControllers.create.bind(professorControllers));
professorRoutes.put("/:id", validateBody(updateProfessorSchema), professorControllers.update.bind(professorControllers));
professorRoutes.delete("/:id", validateParams(deleteProfessorSchema), professorControllers.delete.bind(professorControllers));

export { professorRoutes };