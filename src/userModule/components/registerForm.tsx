import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister, useGetAllIdentificationTypes } from "../hooks"
import { userSchema, type User } from "../validators/userValidators"
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
import { useCallback } from "react"
import { useNavigate } from "react-router"
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
    const form = useForm<User>({
        resolver: zodResolver(userSchema) as Resolver<User>,
        mode: "onChange",
        defaultValues: {
            names: "",
            lastNames: "",
            email: "",
            address: "",
            phone: "",
            password: "",
            isAdmin: false,
            identification: "",
            identificationTypeId: "",
        },
    })

    console.log(form.formState.errors);

    const navigate = useNavigate()

    const registerMutation = useRegister()

    const onSubmit = useCallback(async (data: User) => {
        const toastId = toast.loading("Creando usuario...");
        try {
            await registerMutation.mutateAsync(data);
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
                    render={({ field }) => (
                        <FormItem className="min-w-[210px]">
                            <FormLabel className="text-sm">Contraseña</FormLabel>
                            <FormControl>
                                <Input id="password" type="password" placeholder="Contraseña" autoComplete="current-password" className="h-8 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
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