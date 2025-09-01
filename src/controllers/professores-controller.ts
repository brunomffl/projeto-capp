import { Request, Response } from "express";
import { ProfessorServices } from "@/services/professor-services";

class ProfessorControllers {

    private professorServices: ProfessorServices;

    constructor(){
        this.professorServices = new ProfessorServices();
    }

    async index(req: Request, res: Response){
        return res.status(200).json(await this.professorServices.index());
    }

    async create(req: Request, res: Response){
        const professor = req.body;

        await this.professorServices.create(professor);

        return res.status(201).json({ message: "Usuário criado com sucesso!" });
    }
}

export { ProfessorControllers };