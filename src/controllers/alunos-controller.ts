import { Request, Response } from "express";
import { AlunosService } from "@/services/alunos-service";

class AlunosController {

    private alunosServices: AlunosService;

    constructor(){
        this.alunosServices = new AlunosService();
    }

    async index(req: Request, res: Response){
        const { page = '1', perPage = '10' } = req.query;
        const pagination = {
            page: Number(page),
            perPage: Number(perPage)
        };
        
        // Se for professor, filtrar apenas seus alunos
        const professorUid = req.user?.role === 'professor' ? req.user.uid : undefined;
        
        return res.status(200).json(await this.alunosServices.index(pagination, professorUid));
    };

    async create(req: Request, res: Response){
        const aluno = req.body;

        await this.alunosServices.create(aluno);

        return res.status(201).json({ message: "Aluno criado com sucesso!" });
    };

    async update(req: Request, res: Response){
        const { id } = req.params;
        const aluno = req.body

        await this.alunosServices.update(id, aluno);

        return res.status(200).end();
    }

    async delete(req: Request, res: Response){
        const { id } = req.params;

        await this.alunosServices.delete(id);

        return res.status(200).end();
    }
    
};

export { AlunosController };