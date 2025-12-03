import { Router } from "express";
import { alunosRoutes } from "./alunos-routes";
import { professorRoutes } from "./professores-routes";
import { oficinaRoutes } from "./oficina-routes";
import { aulasRoutes } from "./aulas-routes";
import { presencasRoutes } from "./presencas-routes";
import { pareceresRoutes } from "./pareceres-routes";
import { authRoutes } from "./auth-routes";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";

const routes = Router();

// Rotas de autenticação Google (não protegidas)
routes.use("/auth", authRoutes);

// Rotas protegidas
routes.use(ensureAuthenticated);

routes.use("/professores", 
    verifyUserAuthorization(["admin"]),
    professorRoutes
);

routes.use("/alunos", 
    verifyUserAuthorization(["admin", "professor"]),
    alunosRoutes
);

routes.use("/oficinas", 
    verifyUserAuthorization(["admin", "professor"]), 
    oficinaRoutes
);

routes.use("/aulas", 
    aulasRoutes
);

routes.use("/presencas", 
    presencasRoutes
);

routes.use("/pareceres", 
    pareceresRoutes
);

export { routes };
