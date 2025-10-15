import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { StatusPresenca } from "@prisma/client";

export class PresencasService {
    async listarPresencasPorAula(aula_id: string, professorUid: string) {
        // Verificar se o professor tem acesso à aula
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
                        id: true,
                        titulo: true
                    }
                }
            }
        });

        if (!aula) {
            throw new AppError("Você não tem permissão para visualizar esta aula!", 403);
        }

        // Buscar todos os alunos da oficina e suas presenças nesta aula
        const alunosComPresenca = await prisma.aluno.findMany({
            where: {
                oficina_id: aula.oficina.id,
                ativo: true
            },
            select: {
                id: true,
                nome: true,
                presencas: {
                    where: {
                        aula_id
                    },
                    select: {
                        status: true,
                        updated_at: true
                    }
                }
            },
            orderBy: {
                nome: 'asc'
            }
        });

        // Formatar resposta com status padrão AUSENTE para alunos sem presença registrada
        const presencas = alunosComPresenca.map(aluno => ({
            aluno_id: aluno.id,
            aluno_nome: aluno.nome,
            status: aluno.presencas[0]?.status || 'AUSENTE',
            updated_at: aluno.presencas[0]?.updated_at || null
        }));

        return {
            aula: {
                id: aula.id,
                titulo: aula.titulo,
                data: aula.data,
                oficina_titulo: aula.oficina.titulo
            },
            presencas
        };
    }

    async salvarPresencas(presencas: Array<{ aluno_id: string; status: StatusPresenca }>, aula_id: string, professorUid: string) {
        if (presencas.length === 0) {
            throw new AppError("Nenhuma presença foi informada!", 400);
        }

        // Verificar se o professor tem acesso à aula
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
            }
        });

        if (!aula) {
            throw new AppError("Você não tem permissão para marcar presença nesta aula!", 403);
        }

        // Processar todas as presenças
        const resultado = await Promise.all(
            presencas.map(async ({ aluno_id, status }) => {
                return prisma.presenca.upsert({
                    where: {
                        aula_id_aluno_id: {
                            aula_id,
                            aluno_id
                        }
                    },
                    update: {
                        status
                    },
                    create: {
                        aula_id,
                        aluno_id,
                        status
                    }
                });
            })
        );

        return resultado;
    }
}
