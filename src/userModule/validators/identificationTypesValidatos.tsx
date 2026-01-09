import { z } from "zod"

export const identificationTypeSchema = z.object({
    identificationTypeId: z.union([z.string(), z.number()]),
    type: z.string().min(1, "El tipo de identificación es requerido"),
})

export type IdentificationType = z.infer<typeof identificationTypeSchema>