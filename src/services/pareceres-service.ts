import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { StatusParecer } from "@prisma/client";

interface CreateParecerData {
    aluno_id: string;
    texto_parecer: string;
    ano: number;
}

interface UpdateParecerData {
    texto_parecer?: string;
    status?: StatusParecer;
}

export class PareceresService {
    async create(data: CreateParecerData, professorUid: string) {
        // Verificar se o professor tem acesso ao aluno
        const aluno = await prisma.aluno.findFirst({
            where: {
                id: data.aluno_id,
                oficina: {
                    instrutor: {
                        usuario: {
                            firebase_uid: professorUid
                        }
                    }
                },
                ativo: true
            },
            include: {
                oficina: {
                    select: {
                        titulo: true
                    }
                }
            }
        });

        if (!aluno) {
            throw new AppError("Você não tem permissão para criar parecer para este aluno!", 403);
        }

        // Verificar se já existe parecer para este aluno neste ano
        const parecerExistente = await prisma.parecer.findFirst({
            where: {
                aluno_id: data.aluno_id,
                ano: data.ano
            }
        });

        if (parecerExistente) {
            throw new AppError("Já existe um parecer para este aluno neste ano!", 400);
        }

        const parecer = await prisma.parecer.create({
            data,
            include: {
                aluno: {
                    select: {
                        nome: true,
                        oficina: {
                            select: {
                                titulo: true
                            }
                        }
                    }
                }
            }
        });

        return parecer;
    }

    async listByProfessor(professorUid: string, ano?: number, status?: StatusParecer) {
        const whereClause: any = {
            aluno: {
                oficina: {
                    instrutor: {
                        usuario: {
                            firebase_uid: professorUid
                        }
                    }
                },
                ativo: true
            }
        };

        if (ano) {
            whereClause.ano = ano;
        }

        if (status) {
            whereClause.status = status;
        }

        const pareceres = await prisma.parecer.findMany({
            where: whereClause,
            include: {
                aluno: {
                    select: {
                        nome: true,
                        oficina: {
                            select: {
                                titulo: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { ano: 'desc' },
                { aluno: { nome: 'asc' } }
            ]
        });

        return pareceres;
    }

    async getById(id: string, professorUid: string) {
        const parecer = await prisma.parecer.findFirst({
            where: {
                id,
                aluno: {
                    oficina: {
                        instrutor: {
                            usuario: {
                                firebase_uid: professorUid
                            }
                        }
                    }
                }
            },
            include: {
                aluno: {
                    select: {
                        nome: true,
                        data_nascimento: true,
                        oficina: {
                            select: {
                                titulo: true
                            }
                        }
                    }
                }
            }
        });

        if (!parecer) {
            throw new AppError("Parecer não encontrado!", 404);
        }

        return parecer;
    }

    async update(id: string, data: UpdateParecerData, professorUid: string) {
        // Verificar se o professor tem acesso ao parecer
        const parecerExistente = await this.getById(id, professorUid);

        // Não permitir edição de parecer finalizado
        if (parecerExistente.status === 'FINALIZADO') {
            throw new AppError("Não é possível editar um parecer finalizado!", 400);
        }

        const parecer = await prisma.parecer.update({
            where: { id },
            data,
            include: {
                aluno: {
                    select: {
                        nome: true,
                        oficina: {
                            select: {
                                titulo: true
                            }
                        }
                    }
                }
            }
        });

        return parecer;
    }

    async delete(id: string, professorUid: string) {
        // Verificar se o professor tem acesso ao parecer
        const parecerExistente = await this.getById(id, professorUid);

        // Não permitir exclusão de parecer publicado ou finalizado
        if (parecerExistente.status !== 'RASCUNHO') {
            throw new AppError("Só é possível excluir pareceres em rascunho!", 400);
        }

        await prisma.parecer.delete({
            where: { id }
        });

        return { message: "Parecer excluído com sucesso!" };
    }

    async getByAlunoEAno(aluno_id: string, ano: number, professorUid: string) {
        // Verificar se o professor tem acesso ao aluno
        const aluno = await prisma.aluno.findFirst({
            where: {
                id: aluno_id,
                oficina: {
                    instrutor: {
                        usuario: {
                            firebase_uid: professorUid
                        }
                    }
                },
                ativo: true
            }
        });

        if (!aluno) {
            throw new AppError("Você não tem permissão para acessar este aluno!", 403);
        }

        const parecer = await prisma.parecer.findFirst({
            where: {
                aluno_id,
                ano
            },
            include: {
                aluno: {
                    select: {
                        nome: true,
                        data_nascimento: true,
                        oficina: {
                            select: {
                                titulo: true
                            }
                        }
                    }
                }
            }
        });

        return parecer;
    }
}
