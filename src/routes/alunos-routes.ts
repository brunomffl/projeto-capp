import { Router } from "express";
import { AlunosController } from "@/controllers/alunos-controller";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { createAlunoSchema, deleteAlunoSchema, updateAlunoSchema } from "@/schemas/alunos-schema";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";

const alunosRoutes = Router();
const alunosController = new AlunosController();

alunosRoutes.get("/",
    verifyUserAuthorization(["admin", "professor"]),
    alunosController.index.bind(alunosController)
);

alunosRoutes.post("/",
    verifyUserAuthorization(["admin"]),
    validateBody(createAlunoSchema),
    alunosController.create.bind(alunosController)
);

alunosRoutes.put("/:id",
    verifyUserAuthorization(["admin"]),
    validateParams(deleteAlunoSchema),
    validateBody(updateAlunoSchema),
    alunosController.update.bind(alunosController)
);

alunosRoutes.delete("/:id",
    verifyUserAuthorization(["admin"]),
    validateBody(deleteAlunoSchema),
    alunosController.delete.bind(alunosController),
);

export { alunosRoutes };