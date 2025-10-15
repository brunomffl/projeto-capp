import { Request, Response } from "express";
import { PresencasService } from "@/services/presencas-service";
import { StatusPresenca } from "@prisma/client";

export class PresencasController {
    private presencasService = new PresencasService();

    async listarPresencasPorAula(req: Request, res: Response) {
        const { aula_id } = req.params;
        const professorUid = req.user?.uid!;

        const dados = await this.presencasService.listarPresencasPorAula(aula_id, professorUid);

        return res.json(dados);
    }

    async salvarPresencas(req: Request, res: Response) {
        const { aula_id } = req.params;
        const { presencas } = req.body;
        const professorUid = req.user?.uid!;

        const resultado = await this.presencasService.salvarPresencas(
            presencas,
            aula_id,
            professorUid
        );

        return res.json({
            message: `${resultado.length} presenças registradas com sucesso!`,
            count: resultado.length
        });
    }
}
