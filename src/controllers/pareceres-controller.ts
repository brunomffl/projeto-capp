import { Request, Response } from "express";
import { PareceresService } from "@/services/pareceres-service";

export class PareceresController {
    private pareceresService = new PareceresService();

    async create(req: Request, res: Response) {
        const { aluno_id, texto_parecer, ano } = req.body;
        const professorUid = req.user?.uid!;

        const parecer = await this.pareceresService.create({
            aluno_id,
            texto_parecer,
            ano
        }, professorUid);

        return res.status(201).json({
            message: "Parecer criado com sucesso!",
            parecer
        });
    }

    async list(req: Request, res: Response) {
        const { ano, status } = req.query;
        const professorUid = req.user?.uid!;

        const pareceres = await this.pareceresService.listByProfessor(
            professorUid,
            ano ? parseInt(ano as string) : undefined,
            status as any
        );

        return res.json(pareceres);
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const professorUid = req.user?.uid!;

        const parecer = await this.pareceresService.getById(id, professorUid);

        return res.json(parecer);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { texto_parecer, status } = req.body;
        const professorUid = req.user?.uid!;

        const parecer = await this.pareceresService.update(id, {
            texto_parecer,
            status
        }, professorUid);

        return res.json({
            message: "Parecer atualizado com sucesso!",
            parecer
        });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const professorUid = req.user?.uid!;

        const result = await this.pareceresService.delete(id, professorUid);

        return res.json(result);
    }

    async getByAlunoEAno(req: Request, res: Response) {
        const { aluno_id, ano } = req.params;
        const professorUid = req.user?.uid!;

        const parecer = await this.pareceresService.getByAlunoEAno(
            aluno_id,
            parseInt(ano),
            professorUid
        );

        if (!parecer) {
            return res.status(404).json({
                message: "Parecer não encontrado para este aluno neste ano"
            });
        }

        return res.json(parecer);
    }
}
