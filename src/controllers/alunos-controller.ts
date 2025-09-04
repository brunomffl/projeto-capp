import { Request, Response } from "express";
import { AlunosService } from "@/services/alunos-service";

class AlunosController {

    private alunosServices: AlunosService;

    constructor(){
        this.alunosServices = new AlunosService();
    }

    async index(req: Request, res: Response){
        return res.status(200).json(await this.alunosServices.index());
    };

    async create(req: Request, res: Response){
        const aluno = req.body;

        await this.alunosServices.create(aluno);

        return res.status(201).json({ message: "Aluno criado com sucesso!" });
    };

    async delete(req: Request, res: Response){
        const { id } = req.params;

        await this.alunosServices.delete(id);

        return res.status(200).end();
    }
    
};

export { AlunosController };