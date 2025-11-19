import { Aluno } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { CreateAlunoSchema, UpdateAlunoSchema } from "@/schemas/alunos-schema";
import { PaginateSchema } from "@/schemas/paginate-schema";

class AlunosService {

    async index(pagination: PaginateSchema, professorUid?: string): Promise<{alunos: Aluno[], paginationProps: { page: number, perPage: number, totalRecords: number, totalPages: number }}>{
        const skip = (pagination.page - 1) * pagination.perPage;

        // Se for professor, filtrar apenas alunos de suas oficinas
        const whereClause = professorUid ? {
            oficina: {
                instrutor: {
                    usuario: {
                        firebase_uid: professorUid
                    }
                }
            },
            ativo: true
        } : { ativo: true };

        const alunos = await prisma.aluno.findMany({
            where: whereClause,
            skip,
            take: pagination.perPage,
            orderBy: { nome: "asc" },
            include: {
                oficina: {
                    select: {
                        titulo: true
                    }
                }
            }
        });

        const totalRecords = await prisma.aluno.count({
            where: whereClause
        });
        
        const totalPages = Math.ceil(totalRecords / pagination.perPage);

        if (alunos.length === 0){
            throw new AppError("Nenhum aluno encontrado!", 404);
        };

        return { 
            alunos, 
            paginationProps: { 
                page: pagination.page , 
                perPage: pagination.perPage, 
                totalRecords, 
                totalPages: totalPages > 0 ? totalPages : 1 } };
    };

    async create(aluno: CreateAlunoSchema): Promise<void>{
        //verifica se a oficina que está tentando cadastrar o aluno existe
        const oficina = await prisma.oficina.findUnique({
            where:{
                id: aluno.oficina_id
            }
        });

        if(!oficina){
            throw new AppError("Oficina não encontrada!", 404)
        }

        if(aluno.data_nascimento > new Date()){
            throw new AppError("Data de nascimento deve ser anterior a hoje", 400);
        };

        //verificar limitação de alunos maxima em uma oficina?

        await prisma.aluno.create({
            data: {
                nome: aluno.nome,
                data_nascimento: aluno.data_nascimento,
                oficina_id: aluno.oficina_id,
            }
        });
    };

    async update(id: string, alunoData: UpdateAlunoSchema): Promise<void>{
        const aluno = await prisma.aluno.findFirst({
            where: { id },
        });

        if(!aluno){
            throw new AppError("Aluno não encontrado!", 404);
        };

        await prisma.aluno.update({
            where: { id },
            data: {
                ...(alunoData.nome && { nome: alunoData.nome }),
                ...(alunoData.data_nascimento && { data_nascimento: alunoData.data_nascimento }),
                ...(alunoData.oficina_id && { oficina_id: alunoData.oficina_id }),
                ...(alunoData.ativo && { ativo: alunoData.ativo })
            }
        })
    };

    async delete(id: string): Promise<void>{
        const aluno = await prisma.aluno.findFirst({
            where: {
                id: id
            }
        });

        if(!aluno){
            throw new AppError("Aluno não encontrado!", 404);
        };

        await prisma.aluno.delete({
            where: { id }
        });
    };
};

export { AlunosService };