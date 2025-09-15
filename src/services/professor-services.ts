import { Professor } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { AuthService } from "./auth-service";
import { PaginateSchema } from "@/schemas/paginate-schema";
import { CreateProfessorData, UpdateProfessorData } from "@/schemas/professor-schema";

class ProfessorServices {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async index(pagination: PaginateSchema): Promise<{ professores: Professor[], paginationProps: { page: number, perPage: number, totalRecords: number, totalPages: number } }>{
        const skip = (pagination.page - 1) * pagination.perPage;

        const professores = await prisma.professor.findMany({
            skip,
            take: pagination.perPage,
            orderBy: { nome: "desc" }
        });

        const totalRecords = await prisma.professor.count();
        const totalPages = Math.ceil(totalRecords / pagination.perPage);

        if(professores.length === 0){
            throw new AppError("Nenhum professor cadastrado!");
        };

        return { 
            professores,
            paginationProps: {
                page: pagination.page,
                perPage: pagination.page,
                totalRecords,
                totalPages
            }
        };
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

    async update(id: string, professor: UpdateProfessorData): Promise<void>{
        const user = await prisma.usuario.findFirst({
            where: {
                firebase_uid: id
            }
        });

        if(!user){
            throw new AppError("Usuário não encontrado!", 404);
        }

        await this.authService.update(id, professor);

        const { password, ...professorData } = professor;
        
        await prisma.usuario.update({
            where: {
                firebase_uid: id
            },
            data: {
                ...(professorData.email && { email: professorData.email }),
                professor: {
                    update: {
                        ...(professorData.nome && { nome: professorData.nome }),
                        ...(professorData.cpf && { cpf: professorData.cpf })
                    }
                }
            },
            include: { professor: true }
        });
    }

    async delete(id: string){
        const user = await prisma.usuario.findFirst({
            where: {
                firebase_uid: id
            }
        });

        if(!user){
            throw new AppError("Usuário não encontrado!", 404);
        };
        //deleta professor
        await prisma.professor.delete({
            where: {
                usuario_id: user.id
            }
        })
        //deleta usuário
        await prisma.usuario.delete({
            where: {
                firebase_uid: id
            },
            include: { professor: true }
        });
        //deleta no firebase
        await this.authService.delete(id);

    }
};

export { ProfessorServices };
