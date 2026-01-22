import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/useLogin"
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
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { Link } from "react-router"

export default function LoginForm() {
    const navigate = useNavigate()
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const loginMutation = useLogin()

    const onSubmit = async (data: LoginInput) => {
        const toastId = toast.loading("Accediendo...");
        try {
            await loginMutation.mutateAsync(data);
            toast.success("Acceso exitoso", { id: toastId });
            setTimeout(() => {
                navigate("/")
            }, 1000)
        } catch (error: any) {
            toast.error(error.message || "Error al iniciar sesión", { id: toastId });
        }
    }

    return (
        <Form {...form}>
            <form
                className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6"
                onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <h2
                    className="text-2xl font-semibold mb-4 text-center">
                    Iniciar Sesión
                </h2>
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

                <div className="mt-3 px-2 flex justify-end">
                    <Button type="submit" className="h-8 w-full px-3 text-sm" disabled={loginMutation.status === 'pending'}>
                        {loginMutation.status === 'pending' ? "Ingresando..." : "Ingresar"}
                    </Button>
                </div>

                <hr className="my-3" />

                <Link to={`${import.meta.env.VITE_API_BASE_URL}/auth/login/google`} className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <Button type="button" className="basis-full h-8 py-5 text-sm w-full sm:w-auto">
                        <img src="/googleIcon/google-48.png" alt="Google Icon" className="w-5 h-5 mr-2 inline-block align-middle" />
                    </Button>
                </Link>
                {/* {loginGoogleQuery.isError && (
                        <p className="text-sm text-red-600">Error Google: {String(loginGoogleQuery.error?.message)}</p>
                    )} */}
                <div>
                    <p
                        className="text-xs">Google icon by Icons8</p>
                </div>
            </form>
        </Form>
    )
}