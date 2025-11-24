import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/useLogin"
import { useLoginGoogle } from "../hooks/useLoginGoogle"
import { loginSchema, type LoginInput } from "../validators/userValidators"

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    })

    const loginMutation = useLogin()

    const onSubmit = (data: LoginInput) => {
        loginMutation.mutate(data)
    }

    const loginGoogleQuery = useLoginGoogle({ enabled: false })

    const handleGoogleLogin = () => {
        // El hook devuelve un UseQueryResult; usamos refetch para iniciar el proceso on demand
        void loginGoogleQuery.refetch()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <label htmlFor="email">Correo</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p style={{ color: "red" }}>{String(errors.email.message)}</p>
                )}
            </div>

            <div>
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                />
                {errors.password && (
                    <p style={{ color: "red" }}>{String(errors.password.message)}</p>
                )}
            </div>

            <div>
                <button type="submit" disabled={loginMutation.status === 'pending'}>
                    {loginMutation.status === 'pending' ? "Ingresando..." : "Ingresar"}
                </button>
            </div>

            {loginMutation.isError && (
                <p style={{ color: "red" }}>Error: {loginMutation.error?.message}</p>
            )}

            <hr />

            <div>
                <button type="button" onClick={handleGoogleLogin} disabled={loginGoogleQuery.isFetching}>
                    {loginGoogleQuery.isFetching ? "Redirigiendo..." : "Ingresar con Google"}
                </button>
                {loginGoogleQuery.isError && (
                    <p style={{ color: "red" }}>Error Google: {loginGoogleQuery.error?.message}</p>
                )}
            </div>
        </form>
    )
}