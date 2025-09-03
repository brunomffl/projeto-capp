import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

export function verifyUserAuthorization(role: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user){
            throw new AppError("Usuário não autorizado", 403);
        };

        if(!role.includes(req.user.role)){
            throw new AppError("Usuário não autorizado", 403);
        };

        next();
    };
};