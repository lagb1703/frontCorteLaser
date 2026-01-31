import { z } from "zod"

export const thicknessSchema = z.object({
    thicknessId: z.union([z.string(), z.number()]).optional().nullable(),
    name: z.string(),
    price: z.number().int().min(0),
    speed: z.number().int().min(0).optional().nullable(),
    lastModification: z.string().optional().nullable(),
})

export type Thickness = z.infer<typeof thicknessSchema>