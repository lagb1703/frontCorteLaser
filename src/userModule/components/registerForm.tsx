import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister, useGetAllIdentificationTypes } from "../hooks"
import { registerSchema, type RegisterFormValues, type User } from "../validators/userValidators"
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
import { useCallback, useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeClosed } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function RegisterForm() {
    const { data: identificationTypes } = useGetAllIdentificationTypes();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema) as Resolver<RegisterFormValues>,
        mode: "onChange",
        defaultValues: {
            names: "",
            lastNames: "",
            email: "",
            address: "",
            phone: "",
            password: "",
            confirmPassword: "",
            isAdmin: false,
            identification: "",
            identificationTypeId: "",
        },
    })

    const navigate = useNavigate()

    const registerMutation = useRegister()

    const onSubmit = useCallback(async (data: RegisterFormValues) => {
        const toastId = toast.loading("Creando usuario...");
        try {
            const { confirmPassword, ...payload } = data as any
            await registerMutation.mutateAsync(payload as User);
            toast.success("Usuario creado exitosamente", { id: toastId });
            setTimeout(() => {
                navigate("/login")
            }, 1000)
        } catch (error: any) {
            toast.error(error.message || "Error al crear el usuario", { id: toastId });
        }
    }, [registerMutation, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="w-full px-10">
                <div
                    className="flex w-full flex-wrap justify-between">
                    <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => (
                            <FormItem className="basis-full lg:basis-[48%] min-w-[210px]">
                                <FormLabel className="text-sm">Nombres</FormLabel>
                                <FormControl>
                                    <Input id="names" placeholder="Nombres" autoComplete="given-name" className="h-8 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastNames"
                        render={({ field }) => (
                            <FormItem className="basis-full lg:basis-[48%] min-w-[210px]">
                                <FormLabel className="text-sm">Apellidos</FormLabel>
                                <FormControl>
                                    <Input id="lastNames" placeholder="Apellidos" autoComplete="family-name" className="h-8 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="min-w-[210px]">
                            <FormLabel className="text-sm">Correo</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" placeholder="correo@ejemplo.com" autoComplete="email" className="h-8 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div
                    className="flex w-full flex-wrap justify-between">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="basis-full lg:basis-[48%] min-w-[210px]">
                                <FormLabel className="text-sm">Dirección</FormLabel>
                                <FormControl>
                                    <Input id="address" placeholder="Dirección" autoComplete="street-address" className="h-8 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="basis-full lg:basis-[48%] min-w-[210px]">
                                <FormLabel className="text-sm">Teléfono</FormLabel>
                                <FormControl>
                                    <Input id="phone" type="tel" placeholder="Teléfono" autoComplete="tel" className="h-8 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                        const [showPassword, setShowPassword] = useState(false)
                        return (
                            <FormItem className="min-w-[210px]">
                                <FormLabel className="text-sm">Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Contraseña" autoComplete="current-password" className="h-8 text-sm pr-9" {...field} />
                                        <button type="button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {!showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => {
                        const [showConfirm, setShowConfirm] = useState(false)
                        return (
                            <FormItem className="min-w-[210px]">
                                <FormLabel className="text-sm">Confirmar contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirmar contraseña" autoComplete="new-password" className="h-8 text-sm pr-9" {...field} />
                                        <button type="button" aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowConfirm((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {!showConfirm ? <EyeClosed size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                <div
                    className="flex w-full flex-wrap justify-between">
                    <div
                        className="basis-full lg:basis-[48%] min-w-[210px] flex items-end">
                        <Select
                            onValueChange={(val) => form.setValue("identificationTypeId", val, { shouldValidate: true })}>
                            <SelectTrigger className="basis-full">
                                <SelectValue placeholder="Tipo de identificación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipos de identificación</SelectLabel>
                                    {
                                        identificationTypes?.map((type) => (
                                            <SelectItem
                                                key={type.identificationTypeId}
                                                value={String(type.identificationTypeId!)}
                                            >
                                                {type.type}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <FormField
                        control={form.control}
                        name="identification"
                        render={({ field }) => (
                            <FormItem className="basis-full lg:basis-[48%] min-w-[210px]">
                                <FormLabel className="text-sm">Identificación</FormLabel>
                                <FormControl>
                                    <Input id="identification" type="tel" placeholder="Numero Identificación" className="h-8 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-full flex justify-center mt-4">
                    <Button type="submit" className="w-[70%] py-5 h-8 px-3 text-sm" disabled={registerMutation.status === "pending" || !form.formState.isValid}>
                        {registerMutation.status === "pending" ? "Creando..." : "Crear usuario"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}