import { z } from "zod";

export const createOficinaSchema = z.object({
  titulo: z.string().min(3, "Título muito curto"),
  descricao: z.string().min(10, "Descrição muito curta"),
  instrutorId: z.string().uuid(),
  dataInicio: z.string().transform((val) => new Date(val)),
  dataFim: z.string().transform((val) => new Date(val)),
  capacidade: z.number().positive(),
});

export const updateOficinaSchema = z.object({
  titulo: z.string().min(3, "Título muito curto").optional(),
  descricao: z.string().min(10, "Descrição muito curta").optional(),
  instrutorId: z.string().uuid().optional(),
  dataInicio: z.string().transform((val) => new Date(val)).optional(),
  dataFim: z.string().transform((val) => new Date(val)).optional(),
  capacidade: z.number().positive().optional(),
});

export const deleteOficinaSchema = z.object({
    id: z.string()
});


export type CreateOficinaSchema = z.infer<typeof createOficinaSchema>;
export type UpdateOficinaSchema = z.infer<typeof updateOficinaSchema>;
export type DeleteOficinaSchema = z.infer<typeof deleteOficinaSchema>;