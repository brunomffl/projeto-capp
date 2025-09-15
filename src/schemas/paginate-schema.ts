import { z } from "zod";

export const paginateSchema = z.object({
    page: z.coerce.number().optional().default(1),
    perPage: z.coerce.number().optional().default(10)
});

export type PaginateSchema = z.infer<typeof paginateSchema>;