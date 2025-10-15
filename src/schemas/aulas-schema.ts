import { z } from "zod";

export const createAulaSchema = z.object({
    oficina_id: z.string().uuid("ID da oficina deve ser um UUID válido"),
    titulo: z.string().min(1, "Título é obrigatório").max(200, "Título deve ter no máximo 200 caracteres"),
    descricao: z.string().max(1000, "Descrição deve ter no máximo 1000 caracteres").optional(),
    data: z.string().datetime("Data deve estar no formato ISO válido")
});

export const aulaParamsSchema = z.object({
    id: z.string().uuid("ID da aula deve ser um UUID válido")
});

export const oficinaParamsSchema = z.object({
    oficina_id: z.string().uuid("ID da oficina deve ser um UUID válido")
});

export type CreateAulaSchema = z.infer<typeof createAulaSchema>;
export type AulaParamsSchema = z.infer<typeof aulaParamsSchema>;
export type OficinaParamsSchema = z.infer<typeof oficinaParamsSchema>;