import { z } from "zod"

export const acceptanceTokenSchema = z.object({
    acceptance_token: z.string(),
    permalink: z.string(),
    type: z.string(),
})

export type AcceptanceTokenType = z.infer<typeof acceptanceTokenSchema>

export const acceptanceTokensSchema = z.object({
    presigned_acceptance: acceptanceTokenSchema,
    presigned_personal_data_auth: acceptanceTokenSchema,
})

export type AcceptanceTokens = z.infer<typeof acceptanceTokensSchema>