import { z } from "zod"

export const fileSchema = z.object({
    id: z.number(),
    name: z.string(),
    date: z.date(),
    md5: z.string(),
    bucket: z.string(),
})

export type FileDb = z.infer<typeof fileSchema>