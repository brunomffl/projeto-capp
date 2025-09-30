import { Oficina } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { CreateOficinaSchema, UpdateOficinaSchema } from "@/schemas/oficina-schema";
import { PaginateSchema } from "@/schemas/paginate-schema";

class OficinasService {

    async index(pagination: PaginateSchema): Promise<{ oficinas: Oficina[], paginationProps: { page: number, perPage: number, totalRecords: number, totalPages: number } }> {
      const skip = (pagination.page - 1) * pagination.perPage;

      const oficinas = await prisma.oficina.findMany({
        skip,
        take: pagination.perPage,
        include: {
          instrutor: {
            select: {
              id: true,
              nome: true,
              cpf: true
            }
          }
        },
        orderBy: { titulo: "desc" }
      });

      if (oficinas.length === 0){
          throw new AppError("Nenhuma oficina cadastrada!", 404);
      };

      const totalRecords = await prisma.oficina.count();
      const totalPages = Math.ceil(totalRecords / pagination.perPage); 

      return { 
          oficinas, 
          paginationProps: { 
              page: pagination.page , 
              perPage: pagination.perPage, 
              totalRecords, 
              totalPages: totalPages > 0 ? totalPages : 1 } 
      };
    };

  async create(data: CreateOficinaSchema) {
    const professor = await prisma.professor.findFirst({
      where: {
        id: data.instrutorId
      }
    });

    if (!professor){
      throw new AppError("Professor não encontrado para vincula à oficina!", 404);
    }

    return prisma.oficina.create({ 
      data,
      include: {
        instrutor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      }
    });
  }

  async update(id: string, data: UpdateOficinaSchema) {
    const oficina = await prisma.oficina.findFirst({
      where: {
        id
      }
    });

    if(data.instrutorId){
      const professor = await prisma.professor.findFirst({
        where:{
          id: data.instrutorId
        }
      });
      
      if (!professor){
        throw new AppError("Professor não encontrado para vincular à oficina!", 404);
      };
    }

    if (!oficina){
      throw new AppError("Oficina não encontrada!", 404);
    };

    return prisma.oficina.update({
      where: { id },
      data,
      include: {
        instrutor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    const oficina = await prisma.oficina.findFirst({
      where: {
        id
      }
    });

    if (!oficina){
      throw new AppError("Oficina não encontrada!", 404);
    }

    return prisma.oficina.delete({ where: { id } });
  }

  async inscrever(oficinaId: string, alunoId: string) {
    const oficina = await prisma.oficina.findUnique({
      where: { id: oficinaId },
      include: { alunos: true },
    });

    if (!oficina) throw new AppError("Oficina não encontrada");

    return prisma.oficina.update({
      where: { id: oficinaId },
      data: {
        alunos: {
          connect: { id: alunoId },
        },
      },
    });
  };
}

export { OficinasService };