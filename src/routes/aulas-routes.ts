import { Router } from "express";
import { AulasController } from "@/controllers/aulas-controller";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { createAulaSchema, aulaParamsSchema, oficinaParamsSchema } from "@/schemas/aulas-schema";

const aulasRoutes = Router();
const aulasController = new AulasController();

aulasRoutes.use(ensureAuthenticated);
aulasRoutes.use(verifyUserAuthorization(["professor"]));

aulasRoutes.post(
    "/",
    validateBody(createAulaSchema),
    aulasController.create.bind(aulasController)
);

aulasRoutes.get(
    "/minhas-oficinas",
    aulasController.listOficinasComAulas.bind(aulasController)
);

aulasRoutes.get(
    "/oficina/:oficina_id",
    validateParams(oficinaParamsSchema),
    aulasController.listByOficina.bind(aulasController)
);

aulasRoutes.get(
    "/:id",
    validateParams(aulaParamsSchema),
    aulasController.getById.bind(aulasController)
);

export { aulasRoutes };
