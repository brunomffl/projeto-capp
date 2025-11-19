import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { StatusParecer } from "@prisma/client";
import { GoogleDocsService } from "./google-docs-service";

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
    private googleDocsService = new GoogleDocsService();

    async create(data: CreateParecerData, professorUid: string) {
        // Verificar se OAuth2 está configurado
        if (!global.oauthClient || !global.oauthTokens) {
            throw new AppError("❌ Autenticação Google necessária. Faça login em /auth/google", 401);
        }
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

    async publicarNoGoogleDocs(id: string, professorUid: string) {
        // Verificar se OAuth2 está configurado
        if (!global.oauthClient || !global.oauthTokens) {
            throw new AppError("❌ Autenticação Google necessária. Faça login em /auth/google", 401);
        }

        // Verificar se o professor tem acesso ao parecer
        const parecer = await this.getById(id, professorUid);

        // Só pode publicar se estiver em RASCUNHO ou PUBLICADO
        if (parecer.status === 'FINALIZADO') {
            throw new AppError("Não é possível republicar um parecer finalizado!", 400);
        }

        try {
            const alunoNome = parecer.aluno.nome;
            const oficinaTitulo = parecer.aluno.oficina.titulo;
            const ano = parecer.ano;

            // Título do documento
            const documentTitle = `Parecer Descritivo - ${alunoNome} - ${oficinaTitulo} - ${ano}`;

            // Conteúdo formatado
            const documentContent = `PARECER DESCRITIVO

👨‍🎓 Aluno: ${alunoNome}
🏫 Oficina: ${oficinaTitulo}
📅 Ano: ${ano}
🎂 Data de Nascimento: ${new Date(parecer.aluno.data_nascimento).toLocaleDateString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 DESCRIÇÃO DO PARECER:

${parecer.texto_parecer}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Data de publicação: ${new Date().toLocaleDateString('pt-BR')}
🔐 Publicado via Sistema CAPP`;

            let documentId = parecer.google_doc_id;
            let documentUrl = parecer.google_doc_url;

            if (documentId) {
                // Atualizar documento existente
                console.log(`🔄 Atualizando documento existente: ${documentId}`);
                await this.googleDocsService.updateDocument(documentId, documentContent);
                console.log("✅ Documento atualizado com sucesso!");
            } else {
                // Criar novo documento
                console.log("🚀 Criando novo documento no Google Docs...");
                const result = await this.googleDocsService.createDocument(documentTitle, documentContent);
                documentId = result.documentId;
                documentUrl = result.documentUrl;
                console.log("✅ Documento criado com sucesso:", { documentId, documentUrl });
            }

            // Atualizar parecer no banco com informações do Google Docs
            const parecerAtualizado = await prisma.parecer.update({
                where: { id },
                data: {
                    google_doc_id: documentId,
                    google_doc_url: documentUrl,
                    status: 'PUBLICADO',
                    data_publicacao: new Date()
                },
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

            return parecerAtualizado;
        } catch (error) {
            console.error('Erro ao publicar parecer no Google Docs:', error);
            throw new AppError("Erro ao publicar parecer no Google Docs. Tente novamente.", 500);
        }
    }

    async finalizarParecer(id: string, professorUid: string) {
        // Verificar se o professor tem acesso ao parecer
        const parecer = await this.getById(id, professorUid);

        // Só pode finalizar se estiver PUBLICADO
        if (parecer.status !== 'PUBLICADO') {
            throw new AppError("Só é possível finalizar pareceres que estão publicados!", 400);
        }

        // Finalizar parecer
        const parecerFinalizado = await prisma.parecer.update({
            where: { id },
            data: {
                status: 'FINALIZADO'
            },
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

        return parecerFinalizado;
    }
}
