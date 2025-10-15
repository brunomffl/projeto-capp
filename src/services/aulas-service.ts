import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { CreateAulaSchema } from "@/schemas/aulas-schema";

export class AulasService {
    async create({ oficina_id, titulo, descricao, data }: CreateAulaSchema, professorUid: string) {
        const oficina = await prisma.oficina.findFirst({
            where: {
                id: oficina_id,
                instrutor: {
                    usuario: {
                        firebase_uid: professorUid
                    }
                }
            }
        });

        if (!oficina) {
            throw new AppError("Você não tem permissão para criar aulas nesta oficina!", 403);
        }

        const aula = await prisma.aula.create({
            data: {
                oficina_id,
                titulo,
                descricao,
                data: new Date(data)
            },
            include: {
                oficina: {
                    select: {
                        titulo: true
                    }
                }
            }
        });

        return aula;
    }

    async listByOficina(oficina_id: string, professorUid: string) {
        // Verificar se o professor tem acesso à oficina
        const oficina = await prisma.oficina.findFirst({
            where: {
                id: oficina_id,
                instrutor: {
                    usuario: {
                        firebase_uid: professorUid
                    }
                }
            }
        });

        if (!oficina) {
            throw new AppError("Você não tem permissão para visualizar estas aulas!", 403);
        }

        const aulas = await prisma.aula.findMany({
            where: {
                oficina_id
            },
            orderBy: {
                data: 'desc'
            },
            include: {
                _count: {
                    select: {
                        presencas: true
                    }
                }
            }
        });

        return aulas;
    }

    async listOficinasComAulas(professorUid: string) {
        // Buscar todas as oficinas do professor com suas aulas
        const oficinas = await prisma.oficina.findMany({
            where: {
                instrutor: {
                    usuario: {
                        firebase_uid: professorUid
                    }
                }
            },
            select: {
                id: true,
                titulo: true,
                descricao: true,
                dataInicio: true,
                dataFim: true,
                aulas: {
                    orderBy: {
                        data: 'desc'
                    },
                    select: {
                        id: true,
                        titulo: true,
                        data: true,
                        _count: {
                            select: {
                                presencas: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                titulo: 'asc'
            }
        });

        return oficinas;
    }

    async getById(aula_id: string, professorUid: string) {
        const aula = await prisma.aula.findFirst({
            where: {
                id: aula_id,
                oficina: {
                    instrutor: {
                        usuario: {
                            firebase_uid: professorUid
                        }
                    }
                }
            },
            include: {
                oficina: {
                    select: {
                        titulo: true
                    }
                }
            }
        });

        if (!aula) {
            throw new AppError("Aula não encontrada!", 404);
        }

        return aula;
    }
}
