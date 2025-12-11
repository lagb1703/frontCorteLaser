import { useInfo } from "../hooks";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface props {
    disable?: boolean;
}

export default function UserReview({ disable = false }: props) {
    const { form, handleSummit, changeStatus } = useInfo();
    return (
        <Form {...form}>
            <form
                className="space-y-6 w-full max-w-lg p-2"
                noValidate>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="flex flex-wrap w-full justify-between">
                            <FormField
                                control={form.control}
                                name="names"
                                render={({ field }) => (
                                    <FormItem
                                        className="basis-full lg:basis-[48%]">
                                        <FormLabel>Nombres</FormLabel>
                                        <FormControl>
                                            <Input id="names" {...field} disabled={disable || true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastNames"
                                render={({ field }) => (
                                    <FormItem
                                        className="basis-full lg:basis-[48%]">
                                        <FormLabel>Apellidos</FormLabel>
                                        <FormControl>
                                            <Input id="lastNames" {...field} disabled={disable || true} />
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
                                <FormItem>
                                    <FormLabel>Correo</FormLabel>
                                    <FormControl>
                                        <Input id="email" type="email" {...field} disabled={disable || true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div
                            className="flex flex-wrap w-full justify-between">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem
                                        className="basis-full lg:basis-[48%]">
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
                                    <FormItem
                                        className="basis-full lg:basis-[48%]">
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input id="phone" type="tel" {...field} disabled={disable || true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className="flex w-full justify-center mt-4">
                            <Button
                                onClick={form.handleSubmit(handleSummit)}
                                disabled={changeStatus === "pending" || disable}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
                            >
                                {changeStatus === "pending" ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}