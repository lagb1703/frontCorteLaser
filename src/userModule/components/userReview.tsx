import { useInfo } from "../hooks";
import { type User } from "../validators/userValidators";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface props {
    disable?: boolean;
}

export default function UserReview({ disable = false }: props) {
    const { form, handleSummit, changeStatus } = useInfo();
    console.log(form.formState.errors);
    return (
        <Form {...form}>
            <form noValidate>
                <h2>Editar Usuario</h2>

                <FormField
                    control={form.control}
                    name="names"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl>
                                <Input id="names" {...field} disabled={disable} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastNames"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                                <Input id="lastNames" {...field} disabled={disable} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Correo</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" {...field} disabled={disable} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input id="address" {...field} disabled={disable} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                                <Input id="phone" type="tel" {...field} disabled={disable} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!disable && (
                    <div>
                        <Button
                            onClick={form.handleSubmit(handleSummit)}

                            disabled={changeStatus === "pending"}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
                        >
                            {changeStatus === "pending" ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
}