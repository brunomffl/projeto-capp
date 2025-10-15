import { Request, Response } from "express";
import { AulasService } from "@/services/aulas-service";
import { CreateAulaSchema } from "@/schemas/aulas-schema";

export class AulasController {
    private aulasService = new AulasService();

    async create(req: Request, res: Response) {
        const { oficina_id, titulo, descricao, data } = req.body as CreateAulaSchema;
        const professorUid = req.user?.uid!;

        const aula = await this.aulasService.create({
            oficina_id,
            titulo,
            descricao,
            data
        }, professorUid);

        return res.status(201).json({
            message: "Aula criada com sucesso!",
            aula
        });
    }

    async listByOficina(req: Request, res: Response) {
        const { oficina_id } = req.params;
        const professorUid = req.user?.uid!;

        const aulas = await this.aulasService.listByOficina(oficina_id, professorUid);

        return res.json(aulas);
    }

    async listOficinasComAulas(req: Request, res: Response) {
        const professorUid = req.user?.uid!;

        const oficinas = await this.aulasService.listOficinasComAulas(professorUid);

        return res.json(oficinas);
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const professorUid = req.user?.uid!;

        const aula = await this.aulasService.getById(id, professorUid);

        return res.json(aula);
    }
}
