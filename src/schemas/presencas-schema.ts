import { z } from "zod";

export const statusPresencaSchema = z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADA"], {
    message: "Status deve ser PRESENTE, AUSENTE ou JUSTIFICADA"
});

export const presencaItemSchema = z.object({
    aluno_id: z.string().uuid("ID do aluno deve ser um UUID válido"),
    status: statusPresencaSchema
});

export const salvarPresencasSchema = z.object({
    presencas: z.array(presencaItemSchema).min(1, "Deve haver pelo menos uma presença na lista")
});

export const aulaPresencaParamsSchema = z.object({
    aula_id: z.string().uuid("ID da aula deve ser um UUID válido")
});

export type StatusPresencaSchema = z.infer<typeof statusPresencaSchema>;
export type PresencaItemSchema = z.infer<typeof presencaItemSchema>;
export type SalvarPresencasSchema = z.infer<typeof salvarPresencasSchema>;
export type AulaPresencaParamsSchema = z.infer<typeof aulaPresencaParamsSchema>;
