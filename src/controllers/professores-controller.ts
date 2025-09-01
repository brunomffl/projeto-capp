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
}

export { ProfessorControllers };