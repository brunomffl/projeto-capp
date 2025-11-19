import { z } from "zod";

export const statusParecerSchema = z.enum(["RASCUNHO", "PUBLICADO", "FINALIZADO"], {
    message: "Status deve ser RASCUNHO, PUBLICADO ou FINALIZADO"
});

export const createParecerSchema = z.object({
    aluno_id: z.string().uuid("ID do aluno deve ser um UUID válido"),
    texto_parecer: z.string().min(10, "Parecer deve ter pelo menos 10 caracteres"),
    ano: z.number().int().min(2020).max(2030, "Ano deve estar entre 2020 e 2030")
});

export const updateParecerSchema = z.object({
    texto_parecer: z.string().min(10, "Parecer deve ter pelo menos 10 caracteres").optional(),
    status: statusParecerSchema.optional()
});

export const parecerParamsSchema = z.object({
    id: z.string().uuid("ID do parecer deve ser um UUID válido")
});

export const alunoParecerParamsSchema = z.object({
    aluno_id: z.string().uuid("ID do aluno deve ser um UUID válido"),
    ano: z.string().regex(/^\d{4}$/, "Ano deve ter 4 dígitos")
});

export const listPareceresQuerySchema = z.object({
    ano: z.string().regex(/^\d{4}$/, "Ano deve ter 4 dígitos").optional(),
    status: statusParecerSchema.optional()
});

export type StatusParecerSchema = z.infer<typeof statusParecerSchema>;
export type CreateParecerSchema = z.infer<typeof createParecerSchema>;
export type UpdateParecerSchema = z.infer<typeof updateParecerSchema>;
export type ParecerParamsSchema = z.infer<typeof parecerParamsSchema>;
export type AlunoParecerParamsSchema = z.infer<typeof alunoParecerParamsSchema>;
export type ListPareceresQuerySchema = z.infer<typeof listPareceresQuerySchema>;
