import { z } from "zod"

export const userSchema = z.object({
    names: z.string().min(1, "El nombre es requerido"),
    lastNames: z.string().min(1, "El apellido es requerido"),
    email: z.string().email("El correo electrónico no es válido"),
    address: z.string().min(1, "La dirección es requerida").optional(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    phone: z.union([
        z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
        z.number().min(1000000, "El teléfono debe tener al menos 7 dígitos")
    ]),
    isAdmin: z.boolean().optional().default(false),
})

export type User = z.infer<typeof userSchema>