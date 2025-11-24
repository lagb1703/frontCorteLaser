import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister } from "../hooks/useRegister"
import { userSchema, type User } from "../validators/userValidators"

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<User>({
        resolver: zodResolver(userSchema) as Resolver<User>,
        mode: "onChange",
        defaultValues: {
            isAdmin: false,
        },
    })

    const registerMutation = useRegister()

    const onSubmit = (data: User) => {
        registerMutation.mutate(data)
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <label htmlFor="names">Nombres</label>
                <input id="names" {...register("names")} aria-invalid={errors.names ? "true" : "false"} />
                {errors.names && <span role="alert">{String(errors.names.message)}</span>}
            </div>

            <div>
                <label htmlFor="lastNames">Apellidos</label>
                <input id="lastNames" {...register("lastNames")} aria-invalid={errors.lastNames ? "true" : "false"} />
                {errors.lastNames && <span role="alert">{String(errors.lastNames.message)}</span>}
            </div>

            <div>
                <label htmlFor="email">Correo</label>
                <input id="email" type="email" {...register("email")} aria-invalid={errors.email ? "true" : "false"} />
                {errors.email && <span role="alert">{String(errors.email.message)}</span>}
            </div>

            <div>
                <label htmlFor="address">Dirección</label>
                <input id="address" {...register("address")} aria-invalid={errors.address ? "true" : "false"} />
                {errors.address && <span role="alert">{String(errors.address.message)}</span>}
            </div>

            <div>
                <label htmlFor="phone">Teléfono</label>
                <input id="phone" type="tel" {...register("phone")} aria-invalid={errors.phone ? "true" : "false"} />
                {errors.phone && <span role="alert">{String(errors.phone.message)}</span>}
            </div>

            <div>
                <label htmlFor="password">Contraseña</label>
                <input id="password" type="password" {...register("password")} aria-invalid={errors.password ? "true" : "false"} />
                {errors.password && <span role="alert">{String(errors.password.message)}</span>}
            </div>

            <div>
                <button type="submit" disabled={registerMutation.status === "pending" || !isValid}>
                    {registerMutation.status === "pending" ? "Creando..." : "Crear usuario"}
                </button>
            </div>
        </form>
    );
}