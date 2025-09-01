import { z } from "zod";

//dados (usuário + professor)
export type Professor = {
    id: string
    firebase_uid: string
    email: string
    password: string
    papel: 'professor'
    nome: string
    cpf?: string
    data_criacao: Date
};

export const createProfessorSchema = z.object({
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    cpf: z.string().optional()
});

export type CreateProfessorData = z.infer<typeof createProfessorSchema>;
