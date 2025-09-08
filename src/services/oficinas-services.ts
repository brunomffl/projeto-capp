import { Oficina } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { createOficinaSchema, updateOficinaSchema, deleteOficinaSchema } from "@/schemas/oficina-schema";

class OficinasService {

    async index(): Promise<Oficina[]>{
        const oficinas = await prisma.oficina.findMany();

        if (oficinas.length === 0){
            throw new AppError("Nenhuma oficina cadastrada!", 404);
        };

        return oficinas;
    };

  async create(data: any) {
    return prisma.oficina.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.oficina.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
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