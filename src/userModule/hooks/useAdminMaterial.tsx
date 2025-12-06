import { useAddMaterial, useChangeMaterial, useDeleteMaterial } from "@/materialModule/hooks";
import { materialSchema, type Material } from "@/materialModule/validators/materialValidators";
import { useCallback, useState } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";

const refectTimeout = 100; //para el futuro, esto lo hice para que de tiempo a que el backend procese la solicitud antes de volver a obtener los materiales

export function useAdminMaterial(refect?: () => void) {
    const addMaterialMutation = useAddMaterial();
    const changeMaterialMutation = useChangeMaterial();
    const deleteMaterialMutation = useDeleteMaterial();

    const onDelete = useCallback(async (id: number | null) => {
        if (id) {
            const toastId = toast.loading("Eliminando...");
            try {
                await deleteMaterialMutation.mutateAsync(id);
                toast.success("Item eliminado", { id: toastId });
                setTimeout(() => {
                    if (refect) {
                        refect();
                    }
                }, refectTimeout);
            } catch (error: any) {
                toast.error(error?.message || "Error al eliminar item", { id: toastId });
            }
        }
    }, [deleteMaterialMutation, refect]);

    const onEdit = useCallback(async (id: number | null, data: Material) => {
        if (!id) return;
        const toastId = toast.loading("Editando material...");
        try {
            await changeMaterialMutation.mutateAsync({ materialId: id, material: data });
            toast.success("Material editado", { id: toastId });
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar material", { id: toastId });
            return;
        }

    }, [changeMaterialMutation, refect]);

    const onSave = useCallback(async (data: Material) => {
        const toastId = toast.loading("Guardando material...");
        try {
            await addMaterialMutation.mutateAsync(data);
            toast.success("Material guardado", { id: toastId });
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar material", { id: toastId });
        }
    }, [addMaterialMutation, refect]);

    return {
        onSave,
        onEdit,
        onDelete,
        status: {
            isLoading: addMaterialMutation.status === "pending" || changeMaterialMutation.status === "pending",
            isError: addMaterialMutation.status === "error" || changeMaterialMutation.status === "error",
            isSuccess: addMaterialMutation.status === "success" || changeMaterialMutation.status === "success",
            error: (addMaterialMutation as any).error ?? (changeMaterialMutation as any).error,
        },
    };
}