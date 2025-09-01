import { Router } from "express";
import * as professorController from "../controllers/professorController.js";

const router = Router();

// Professor
router.get("/", professorController.getProfessores);
router.get("/:id", professorController.getProfessorById);
router.post("/", professorController.createProfessor);
router.put("/:id", professorController.updateProfessor);
router.delete("/:id", professorController.deleteProfessor);



export default router;