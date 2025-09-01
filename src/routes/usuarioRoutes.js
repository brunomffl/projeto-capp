import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";

const router = Router();

// Usuario
router.get("/", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/", usuarioController.createUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);


export default router;