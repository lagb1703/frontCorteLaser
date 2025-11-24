import { z } from "zod"

export const thicknessSchema = z.object({
    thicknessId: z.optional(z.string()),
    materialId: z.optional(z.string()),
    name: z.string(),
    price: z.number().int(),
    lastModification: z.date(),
})

export type Thickness = z.infer<typeof thicknessSchema>