import { z } from "zod"

export const paymentMethodSchema = z.object({
    id: z.union([z.number(), z.string()]).optional().nullable(),
    name: z.string(),
})

export type PaymentMethodType = z.infer<typeof paymentMethodSchema>

export const paymentMethodWompiSchema = z.object({
    type: z.union([
        z.enum(["CARD", "NEQUI"]),
        z.string(),
    ]),
    phone_number: z.string().optional().nullable(),
    installments: z.number().optional().nullable(),
})

export const paymentMethodWompiSchemaValidated = paymentMethodWompiSchema.superRefine((val, ctx) => {
    const type = typeof val.type === 'string' ? val.type : String(val.type)
    if (type === 'NEQUI') {
        if (!val.phone_number || (typeof val.phone_number === 'string' && val.phone_number.trim() === '')) {
            ctx.addIssue({
                path: ['phone_number'],
                code: z.ZodIssueCode.custom,
                message: 'El número de teléfono es obligatorio para NEQUI',
            })
        }
        if(!val.phone_number || (!/3[0-9]{9}/.test(val.phone_number) && val.phone_number.length !== 10)) {
            ctx.addIssue({
                path: ['phone_number'],
                code: z.ZodIssueCode.custom,
                message: 'El número de teléfono no es válido para NEQUI',
            })
        }
    }
})

export type PaymentMethodWompi = z.infer<typeof paymentMethodWompiSchemaValidated>

export const wompiTokenizerSchema = z.object({
    number: z.string(),
    cvc: z.string(),
    exp_month: z.string(),
    exp_year: z.string(),
    card_holder: z.string(),
})

export type WompiTokenizerType = z.infer<typeof wompiTokenizerSchema>

export const paymentTypeSchema = z.object({
    acceptance_token: z.string().min(1, "Debes aceptar los términos y condiciones"),
    accept_personal_auth: z.string().min(1, "Debes aceptar los términos y condiciones"),
    paymentMethodId: z.union([z.string(), z.number()]),
    amount_in_cents: z.number().optional().nullable(),
    payment_method: paymentMethodWompiSchemaValidated,
    card: wompiTokenizerSchema.optional().nullable(),
    reference: z.string()
}).superRefine((val, ctx) => {
    const type = typeof val.payment_method?.type === 'string' ? val.payment_method.type : String(val.payment_method?.type)
    if (type === 'CARD') {
        if (!val.card) {
            ctx.addIssue({
                path: ['card'],
                code: z.ZodIssueCode.custom,
                message: 'Los datos de la tarjeta son obligatorios para CARD',
            })
            return
        }
        const card = val.card as Record<string, any>
        const requiredFields = ['number', 'cvc', 'exp_month', 'exp_year', 'card_holder']
        requiredFields.forEach((f) => {
            if (!card[f] || (typeof card[f] === 'string' && card[f].trim() === '')) {
                ctx.addIssue({
                    path: ['card', f],
                    code: z.ZodIssueCode.custom,
                    message: `El campo ${f} de la tarjeta es obligatorio para CARD`,
                })
            }
        })
    }
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