import { z } from "zod"

export const userSchema = z.object({
    names: z.string().min(1, "El nombre es requerido"),
    lastNames: z.string().min(1, "El apellido es requerido"),
    email: z.string().email("El correo electrónico no es válido"),
    address: z.string().min(1, "La dirección es requerida"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    phone: z.union([
        z.string().min(10, "El teléfono debe tener al menos 10 dígitos").max(10, "El teléfono debe tener como máximo 10 dígitos"),
        z.number().min(1000000000, "El teléfono debe tener al menos 10 dígitos").max(9999999999, "El teléfono debe tener como máximo 10 dígitos"),
    ]),
    isAdmin: z.boolean().optional().default(false),
    identification: z.string().min(1, "La identificación es requerida"),
    identificationTypeId: z.union([z.string().min(1, "El tipo de identificación es requerido"), z.number()]),
    identificationType: z.string().optional().nullable(),
})

export type User = z.infer<typeof userSchema>