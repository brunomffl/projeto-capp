import { Router } from "express";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { ProfessorControllers } from "@/controllers/professores-controller";
import { createProfessorSchema, deleteProfessorSchema, updateProfessorSchema } from "@/schemas/professor-schema";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";

const professorRoutes = Router();
const professorControllers = new ProfessorControllers();

professorRoutes.get("/", 
    professorControllers.index.bind(professorControllers)
);

professorRoutes.post("/",
    validateBody(createProfessorSchema),
    professorControllers.create.bind(professorControllers)
);

professorRoutes.put("/:id", 
    validateParams(deleteProfessorSchema), 
    validateBody(updateProfessorSchema), 
    professorControllers.update.bind(professorControllers)
);

professorRoutes.delete("/:id", 
    validateParams(deleteProfessorSchema), 
    professorControllers.delete.bind(professorControllers)
);

export { professorRoutes };