import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/useLogin"
import { useLoginGoogle } from "../hooks/useLoginGoogle"
import { loginSchema, type LoginInput } from "../validators/userValidators"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
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
        <Form {...form}>
            <div className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6">
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="text-sm">Correo</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" autoComplete="email" {...field} className="h-8 text-sm px-2" aria-invalid={!!form.formState.errors.email} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="text-sm">Contraseña</FormLabel>
                            <FormControl>
                                <Input id="password" type="password" autoComplete="current-password" {...field} className="h-8 text-sm px-2" aria-invalid={!!form.formState.errors.password} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-3 flex justify-end">
                    <Button type="submit" className="h-8 px-3 text-sm" disabled={loginMutation.status === 'pending'}>
                        {loginMutation.status === 'pending' ? "Ingresando..." : "Ingresar"}
                    </Button>
                </div>

                {loginMutation.isError && (
                    <p style={{ color: "red" }}>Error: {String(loginMutation.error?.message)}</p>
                )}

                <hr className="my-3" />

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <Button type="button" onClick={handleGoogleLogin} className="h-8 px-3 text-sm w-full sm:w-auto" disabled={loginGoogleQuery.isFetching}>
                        {loginGoogleQuery.isFetching ? "Redirigiendo..." : "Ingresar con Google"}
                    </Button>
                    {loginGoogleQuery.isError && (
                        <p className="text-sm text-red-600">Error Google: {String(loginGoogleQuery.error?.message)}</p>
                    )}
                </div>
              </form>
            </div>
        </Form>
    )
}