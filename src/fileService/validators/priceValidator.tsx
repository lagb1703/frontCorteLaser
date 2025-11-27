import { z } from "zod"

export const priceSchema = z.object({
    price: z.number().min(0),
    quoteId: z.union([z.string(), z.number()]),
})

export type PriceResponse = z.infer<typeof priceSchema>