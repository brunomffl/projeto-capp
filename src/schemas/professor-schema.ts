import { z } from "zod";

export const createProfessorSchema = z.object({
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    cpf: z.string().optional()
});

export type CreateProfessorData = z.infer<typeof createProfessorSchema>;
