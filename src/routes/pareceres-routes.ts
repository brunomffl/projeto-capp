import { Router } from "express";
import { PareceresController } from "@/controllers/pareceres-controller";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";
import { validateBody, validateParams, validateQuery } from "@/middleware/ValidateSchema";
import { 
    createParecerSchema, 
    updateParecerSchema, 
    parecerParamsSchema,
    alunoParecerParamsSchema,
    listPareceresQuerySchema
} from "@/schemas/pareceres-schema";

const pareceresRoutes = Router();
const pareceresController = new PareceresController();

// Aplicar middlewares globais para todas as rotas de pareceres
pareceresRoutes.use(ensureAuthenticated);
pareceresRoutes.use(verifyUserAuthorization(["professor"]));

// POST /pareceres - Criar novo parecer
pareceresRoutes.post(
    "/",
    validateBody(createParecerSchema),
    pareceresController.create.bind(pareceresController)
);

// GET /pareceres - Listar pareceres do professor
pareceresRoutes.get(
    "/",
    validateQuery(listPareceresQuerySchema),
    pareceresController.list.bind(pareceresController)
);

// GET /pareceres/aluno/:aluno_id/ano/:ano - Buscar parecer específico por aluno e ano
pareceresRoutes.get(
    "/aluno/:aluno_id/ano/:ano",
    validateParams(alunoParecerParamsSchema),
    pareceresController.getByAlunoEAno.bind(pareceresController)
);

// GET /pareceres/:id - Buscar parecer por ID
pareceresRoutes.get(
    "/:id",
    validateParams(parecerParamsSchema),
    pareceresController.getById.bind(pareceresController)
);

// PUT /pareceres/:id - Atualizar parecer
pareceresRoutes.put(
    "/:id",
    validateParams(parecerParamsSchema),
    validateBody(updateParecerSchema),
    pareceresController.update.bind(pareceresController)
);

// DELETE /pareceres/:id - Excluir parecer
pareceresRoutes.delete(
    "/:id",
    validateParams(parecerParamsSchema),
    pareceresController.delete.bind(pareceresController)
);

export { pareceresRoutes };
