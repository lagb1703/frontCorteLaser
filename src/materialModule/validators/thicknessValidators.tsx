import { z } from "zod"

export const thicknessSchema = z.object({
    thicknessId: z.union([z.string(), z.number()]).optional().nullable(),
    name: z.string(),
    price: z.number().int(),
    lastModification: z.string().optional().nullable(),
})

export type Thickness = z.infer<typeof thicknessSchema>