import { Professor } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { AuthService } from "./auth-service";
import { CreateProfessorData } from "@/schemas/professor-schema";

class ProfessorServices {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async index(): Promise<Professor[]>{
        const professores = await prisma.professor.findMany();

        if(professores.length === 0){
            throw new AppError("Nenhum professor cadastrado!");
        };

        return professores;
    };

    async create(professor: CreateProfessorData): Promise<void>{
        const professorAuth = await this.authService.create(professor);

        const { password, ...professorData } = professor;
        
        await prisma.usuario.create({
            data: {
                firebase_uid: professorAuth.uid,
                email: professorData.email,
                papel: "professor",
                professor: {
                    create: {
                        nome: professor.nome,
                        cpf: professor.cpf,
                    }
                }
            },
            include: { professor: true }
        })
    }
};

export { ProfessorServices };
