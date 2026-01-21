import { z } from "zod"

export const materialSchema = z.object({
    materialId: z.number().optional().nullable(),
    name: z.string(),
    price: z.number().int(),
    weight: z.number().int(),
    lastModification: z.string().optional().nullable(),
})

export type Material = z.infer<typeof materialSchema>