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
    }
    
};

export { AlunosController };