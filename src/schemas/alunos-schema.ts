import { z } from "zod";

export const createAlunoSchema = z.object({
    nome: z.string().min(3, { error: "Nome precisa ter no mínimo 3 caracteres" }),
    data_nascimento: z.date(),
    oficina_id: z.string()
});

export const updateAlunoSchema = z.object({
    nome: z.string().min(3, { error: "Nome precisa ter no mínimo 3 caracteres" }).optional(),
    data_nascimento: z.date().optional(),
    oficina_id: z.string().optional(),
    ativo: z.boolean().optional()
});

export const deleteAlunoSchema = z.object({
    id: z.string()
});

export type CreateAlunoSchema = z.infer<typeof createAlunoSchema>;
export type UpdateAlunoSchema = z.infer<typeof updateAlunoSchema>;
export type DeleteAlunoSchema = z.infer<typeof deleteAlunoSchema>;