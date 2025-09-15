import { Request, Response } from "express";
import { ProfessorServices } from "@/services/professor-services";

class ProfessorControllers {

    private professorServices: ProfessorServices;

    constructor(){
        this.professorServices = new ProfessorServices();
    }

    async index(req: Request, res: Response){
        const { page = '1', perPage = '10' } = req.query;
        const pagination = {
            page: Number(page),
            perPage: Number(perPage)
        }
        return res.status(200).json(await this.professorServices.index(pagination));
    }

    async create(req: Request, res: Response){
        const professor = req.body;

        await this.professorServices.create(professor);

        return res.status(201).json({ message: "Professor criado com sucesso!" });
    }

    async update(req: Request, res: Response){
        const { id } = req.params;
        const professor = req.body;

        await this.professorServices.update(id, professor);

        return res.status(204).end();
    }

    async delete(req: Request, res: Response){
        const { id } = req.params;

        await this.professorServices.delete(id);

        return res.status(204).end();
    }
}

export { ProfessorControllers };