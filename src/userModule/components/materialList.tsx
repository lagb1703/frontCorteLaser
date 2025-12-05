import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { type Material } from "@/materialModule/validators/materialValidators";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface props {
    material: Material | null;
    refetch: (options?: RefetchOptions | undefined) => Promise<
        QueryObserverResult<
            {
                name: string;
                price: number;
                materialId?: number | null | undefined;
                lastModification?: Date | null | undefined;
            }[],
            unknown
        >
    >;
}

interface DeleteAlertDialogProps {
    openAlertDialog: boolean;
    setOpenAlertDialog: (open: boolean) => void;
    onDelete: () => void;
    status: any;
}

function DeleteAlertDialog({ openAlertDialog, setOpenAlertDialog, onDelete, status }: DeleteAlertDialogProps & { status: any }) {
    return (
        <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={status?.isLoading}>
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará el material de forma permanente. ¿Desea continuar?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancelar</Button>
                    </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            const toastId = toast.loading("Eliminando material...");
                                            try {
                                                await onDelete();
                                                toast.success("Material eliminado", { id: toastId });
                                            } catch (error: any) {
                                                toast.error(error?.message || "Error al eliminar material", { id: toastId });
                                            } finally {
                                                setOpenAlertDialog(false);
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function SaveAlertDialog({ openSaveDialog, setOpenSaveDialog, onConfirm, status }: { openSaveDialog: boolean; setOpenSaveDialog: (open: boolean) => void; onConfirm: () => Promise<void>; status: any }) {
    return (
        <AlertDialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
            <AlertDialogTrigger asChild>
                <Button type="button" disabled={status?.isLoading}>
                    {status?.isLoading ? "Guardando..." : "Guardar"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar guardado</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Deseas guardar los cambios realizados en este material?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancelar</Button>
                    </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={async () => {
                                    const toastId = toast.loading("Guardando material...");
                                    try {
                                        await onConfirm();
                                        toast.success("Material guardado", { id: toastId });
                                    } catch (error: any) {
                                        toast.error(error?.message || "Error al guardar material", { id: toastId });
                                    } finally {
                                        setOpenSaveDialog(false);
                                    }
                                }}
                                disabled={status?.isLoading}
                            >
                                Guardar cambios
                            </Button>
                        </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function MaterialItem({ material, refetch }: props) {
    const { register, handleSubmit, formState, status, onDelete } = useAdminMaterial(material, refetch);
    const { errors } = formState as { errors?: Partial<Record<keyof Material, { message?: string }>>; isValid?: boolean };
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openSaveDialog, setOpenSaveDialog] = useState(false);
    return (
        <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-3">
            <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" {...register("name")} />
                {errors?.name && <p className="text-sm text-destructive mt-1">{errors.name?.message}</p>}
            </div>

            <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                    id="price"
                    type="number"
                    step={1}
                    {...register("price", {
                        setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
                    })}
                />
                {errors?.price && <p className="text-sm text-destructive mt-1">{errors.price?.message}</p>}
            </div>

            <div className="flex gap-2">
                {material && (
                    <DeleteAlertDialog
                        openAlertDialog={openAlertDialog}
                        setOpenAlertDialog={setOpenAlertDialog}
                        onDelete={onDelete}
                        status={status}
                    />
                )}

                {/** Save confirmation dialog: triggers handleSubmit when confirmed */}
                <SaveAlertDialog
                    openSaveDialog={openSaveDialog}
                    setOpenSaveDialog={setOpenSaveDialog}
                    onConfirm={async () => {
                        await handleSubmit();
                    }}
                    status={status}
                />
            </div>
        </form>
    );
}

export default function MaterialsList() {
    const { data: materials, isLoading, refetch } = useGetMaterials();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Materiales</h2>

            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent>
                                <Skeleton className="h-4 w-1/2 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {materials?.map((material) => (
                        <Card key={material.materialId}>
                            <CardContent>
                                <MaterialItem material={material} refetch={refetch} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Crear nuevo material</CardTitle>
                </CardHeader>
                <CardContent>
                    <MaterialItem material={null} refetch={refetch} />
                </CardContent>
            </Card>
        </div>
    );
}