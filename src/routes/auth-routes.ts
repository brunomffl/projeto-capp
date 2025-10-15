import { Router } from "express";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { AuthController } from "@/controllers/auth-controller";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/role", 
    ensureAuthenticated,
    authController.getRole.bind(authController)
);

export { authRoutes };