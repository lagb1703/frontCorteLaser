import { z } from "zod"

export const priceSchema = z.object({
    price: z.number().min(0),
    area: z.number().min(0).optional(),
    perimeter: z.number().min(0).optional(),
})

export type PriceResponse = z.infer<typeof priceSchema>