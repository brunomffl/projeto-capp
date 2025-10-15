import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";

interface AuthenticatedRequest extends Request {
    user: {
        uid: string;
        role: 'admin' | 'professor';
    };
}

export class AuthController {
    async getRole(req: Request, res: Response) {
        const authReq = req as AuthenticatedRequest;
        
        if (!authReq.user || !authReq.user.role) {
            throw new AppError("Usuário não autenticado", 401);
        }

        const { role } = authReq.user;

        return res.status(200).json({
            papel: role
        });
    }
}