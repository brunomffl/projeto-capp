import { google } from 'googleapis';
import { AppError } from '@/utils/AppError';

export class GoogleDocsService {
    private docs;
    private drive;
    private oauth2Client;

    constructor(impersonateUser?: string) {
        if (global.oauthClient && global.oauthTokens) {
            // Usar OAuth2 se disponível
            console.log("✅ Usando OAuth2 client existente");
            this.oauth2Client = global.oauthClient;
            this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
            this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        } else {
            // Fallback para Service Account (não funciona para criação de documentos)
            console.log("⚠️ Usando Service Account (modo de fallback)");
            const auth = new google.auth.GoogleAuth({
                keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
                scopes: [
                    'https://www.googleapis.com/auth/documents',
                    'https://www.googleapis.com/auth/drive.file',
                ],
            });

            this.docs = google.docs({ version: 'v1', auth });
            this.drive = google.drive({ version: 'v3', auth });
        }
    }

    async createDocument(title: string, content: string): Promise<{ documentId: string; documentUrl: string }> {
        try {
            if (!this.oauth2Client) {
                throw new AppError("OAuth2 não configurado. Faça login primeiro usando /test/oauth2-start", 401);
            }

            console.log("🚀 Criando documento com OAuth2:", title);

            // 1. Criar documento vazio
            const createResponse = await this.docs.documents.create({
                requestBody: {
                    title: title,
                },
            });

            const documentId = createResponse.data.documentId!;
            console.log("✅ Documento criado! ID:", documentId);

            // 2. Adicionar conteúdo ao documento
            if (content && content.trim()) {
                console.log("🔄 Adicionando conteúdo ao documento...");
                await this.docs.documents.batchUpdate({
                    documentId,
                    requestBody: {
                        requests: [
                            {
                                insertText: {
                                    location: {
                                        index: 1, // Posição após o título
                                    },
                                    text: content + "\n\n📅 Criado em: " + new Date().toLocaleString('pt-BR'),
                                },
                            },
                        ],
                    },
                });
                console.log("✅ Conteúdo adicionado com sucesso!");
            }

            const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

            return {
                documentId,
                documentUrl,
            };
        } catch (error) {
            console.error("❌ Erro ao criar documento:", error);
            throw new AppError("Erro ao criar documento no Google Docs", 500);
        }
    }

    async updateDocument(documentId: string, newContent: string): Promise<void> {
        try {
            // 1. Obter o documento atual para pegar o tamanho do conteúdo
            const doc = await this.docs.documents.get({ documentId });
            const endIndex = doc.data.body?.content?.reduce((acc, element) => {
                return acc + (element.endIndex || 0);
            }, 0) || 1;

            // 2. Limpar conteúdo existente (exceto o título)
            const requests = [];
            if (endIndex > 1) {
                requests.push({
                    deleteContentRange: {
                        range: {
                            startIndex: 1,
                            endIndex: endIndex - 1,
                        },
                    },
                });
            }

            // 3. Inserir novo conteúdo
            if (newContent && newContent.trim()) {
                requests.push({
                    insertText: {
                        location: {
                            index: 1,
                        },
                        text: newContent,
                    },
                });
            }

            if (requests.length > 0) {
                await this.docs.documents.batchUpdate({
                    documentId,
                    requestBody: { requests },
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar documento no Google Docs:', error);
            throw new AppError('Erro ao atualizar documento no Google Docs', 500);
        }
    }

    async getDocumentContent(documentId: string): Promise<string> {
        try {
            const doc = await this.docs.documents.get({ documentId });
            
            let content = '';
            const body = doc.data.body;
            
            if (body && body.content) {
                for (const element of body.content) {
                    if (element.paragraph && element.paragraph.elements) {
                        for (const paragraphElement of element.paragraph.elements) {
                            if (paragraphElement.textRun) {
                                content += paragraphElement.textRun.content || '';
                            }
                        }
                    }
                }
            }
            
            return content;
        } catch (error) {
            console.error('Erro ao obter conteúdo do documento:', error);
            throw new AppError('Erro ao obter conteúdo do documento', 500);
        }
    }

    async deleteDocument(documentId: string): Promise<void> {
        try {
            await this.drive.files.delete({
                fileId: documentId,
            });
        } catch (error) {
            console.error('Erro ao deletar documento no Google Docs:', error);
            throw new AppError('Erro ao deletar documento no Google Docs', 500);
        }
    }
}
