import { z } from "zod"

export const paymentMethodSchema = z.object({
    id: z.union([z.number(), z.string()]).optional().nullable(),
    name: z.string(),
})

export type PaymentMethodType = z.infer<typeof paymentMethodSchema>

export const paymentMethodWompiSchema = z.object({
    type: z.enum(["CARD", "NEQUI"]),
    phone_number: z.string().optional().nullable(),
    installments: z.number().optional().nullable(),
})

export type PaymentMethodWompi = z.infer<typeof paymentMethodWompiSchema>

export const wompiTokenizerSchema = z.object({
    number: z.string(),
    cvc: z.string(),
    exp_month: z.string(),
    exp_year: z.string(),
    card_holder: z.string(),
})

export type WompiTokenizerType = z.infer<typeof wompiTokenizerSchema>

export const paymentTypeSchema = z.object({
    acceptance_token: z.string(),
    accept_personal_auth: z.string(),
    amount_in_cents: z.number().optional().nullable(),
    payment_method: paymentMethodWompiSchema,
    card: wompiTokenizerSchema.optional().nullable(),
    reference: z.string()
})

export type PaymentType = z.infer<typeof paymentTypeSchema>

export const dbPaymentTypeSchema = z.object({
    id: z.string(),
    p_id: z.string(),
    status: z.string(),
    reference: z.string(),
    created_at: z.date(),
    paymentMethod: z.string(),
})

export type DbPaymentType = z.infer<typeof dbPaymentTypeSchema>