import { z } from "zod"

export const priceSchema = z.object({
    price: z.number().min(0),
})

export type PriceResponse = z.infer<typeof priceSchema>