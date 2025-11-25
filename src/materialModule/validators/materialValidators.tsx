import { z } from "zod"

export const materialSchema = z.object({
    materialId: z.optional(z.string()),
    name: z.string(),
    price: z.number().int(),
    lastModification: z.optional(z.date()),
})

export type Material = z.infer<typeof materialSchema>