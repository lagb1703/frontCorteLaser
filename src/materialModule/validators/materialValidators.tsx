import { z } from "zod"

export const materialSchema = z.object({
    materialId: z.number().nullish(),
    name: z.string(),
    price: z.number().int(),
    weight: z.number().int(),
    lastModification: z.string().nullish(),
})

export type Material = z.infer<typeof materialSchema>