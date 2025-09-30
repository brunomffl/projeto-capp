import { Request, Response } from "express";
import { OficinasService } from "@/services/oficinas-services";

class OficinaControllers {
    
    private oficinasService: OficinasService;

    constructor(){
        this.oficinasService = new OficinasService();
    }

    async index(req: Request, res: Response){
        const { page = '1', perPage = '10' } = req.query;
        
        const pagination = {
            page: Number(page),
            perPage: Number(perPage)
        }

        return res.status(200).json(await this.oficinasService.index(pagination));
    };

    async create(req: Request, res: Response){
        const oficina = req.body;

        await this.oficinasService.create(oficina);

        return res.status(201).json({ message: "Oficina criada com sucesso!" });
    }

    async update(req: Request, res: Response){
        const { id } = req.params;
        const oficina = req.body;

        await this.oficinasService.update(id, oficina);

        return res.status(204).end();
    }

    async delete(req: Request, res: Response){
        const { id } = req.params;

        await this.oficinasService.delete(id);

        return res.status(204).end();
    }
}

export { OficinaControllers };