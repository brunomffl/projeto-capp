import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { getAuth } from "firebase-admin/auth";
import { prisma } from "@/database/prisma";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            throw new AppError("Token não encontrado!", 404);
        };

        const [, token] = authHeader.split(" ");

        const decodedIdToken = await getAuth().verifyIdToken(token);

        const user = await prisma.usuario.findFirst({
            where: {
                firebase_uid: decodedIdToken.uid,
            }, 
        });

        if (!user){
            throw new AppError("Usuário não encontrado para autorizar!", 404);
        }

        req.user = {
            uid: decodedIdToken.uid,
            role: user.papel
        };

        return next();
    } catch (error){
        if (error instanceof AppError){
            return next(error);
        };

        return next(new AppError("JWT Inválido", 401));
    }
}