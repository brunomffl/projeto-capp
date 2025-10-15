import { Router } from "express";
import { PresencasController } from "@/controllers/presencas-controller";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { salvarPresencasSchema, aulaPresencaParamsSchema } from "@/schemas/presencas-schema";

const presencasRoutes = Router();
const presencasController = new PresencasController();

presencasRoutes.use(ensureAuthenticated);
presencasRoutes.use(verifyUserAuthorization(["professor"]));

presencasRoutes.get(
    "/aula/:aula_id",
    validateParams(aulaPresencaParamsSchema),
    presencasController.listarPresencasPorAula.bind(presencasController)
);

presencasRoutes.put(
    "/aula/:aula_id",
    validateParams(aulaPresencaParamsSchema),
    validateBody(salvarPresencasSchema),
    presencasController.salvarPresencas.bind(presencasController)
);

export { presencasRoutes };
