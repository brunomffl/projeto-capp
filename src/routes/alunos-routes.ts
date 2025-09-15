import { Router } from "express";
import { AlunosController } from "@/controllers/alunos-controller";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { createAlunoSchema, deleteAlunoSchema, updateAlunoSchema } from "@/schemas/alunos-schema";

const alunosRoutes = Router();
const alunosController = new AlunosController();

alunosRoutes.get("/",
    alunosController.index.bind(alunosController)
);

alunosRoutes.post("/", 
    validateBody(createAlunoSchema),
    alunosController.create.bind(alunosController)
);
alunosRoutes.put("/",
    validateParams(deleteAlunoSchema),
    validateBody(updateAlunoSchema),
    alunosController.update.bind(alunosController)
);

alunosRoutes.delete("/",
    validateBody(deleteAlunoSchema),
    alunosController.delete.bind(alunosController),
);

export { alunosRoutes };