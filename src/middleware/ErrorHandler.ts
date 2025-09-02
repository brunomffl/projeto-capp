import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError, z } from "zod";

export function ErrorHandling(error: any, req: Request, res: Response, next: NextFunction){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({ message: error.message });
    };

    if(error instanceof ZodError){
        return res.status(400).json({
            message: "Erro de validação",
            issues: z.treeifyError(error)
        })
    };

    if(error.code === "auth/email-already-exists"){
        return res.status(400).json({ message: "E-mail já cadastrado!" });
    };

    return res.status(500).json({ message: error.message });
}