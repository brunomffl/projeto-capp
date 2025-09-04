import { Aluno } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { createAlunoSchema, UpdateAlunoSchema, DeleteAlunoSchema, CreateAlunoSchema } from "@/schemas/alunos-schema";

class AlunosService {

    async index(): Promise<Aluno[]>{
        const alunos = await prisma.aluno.findMany();

        if (alunos.length === 0){
            throw new AppError("Nenhum aluno cadastrado!", 404);
        };

        return alunos;
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
    }

    async delete(id: string): Promise<void>{
        const aluno = await prisma.usuario.findFirst({
            where: {
                id
            }
        });

        if(!aluno){
            throw new AppError("Aluno não encontrado!", 404);
        };

        await prisma.aluno.delete({
            where: { id }
        });
    }
};

export { AlunosService };