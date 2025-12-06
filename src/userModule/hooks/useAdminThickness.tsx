import { useAddThickness, useChangeThickness, useDeleteThickness } from "@/materialModule/hooks";
import { useCallback } from "react";
import { toast } from "sonner";
import { thicknessSchema, type Thickness } from "@/materialModule/validators/thicknessValidators";

const refectTimeout = 100; //para el futuro, esto lo hice para que de tiempo a que el backend procese la solicitud antes de volver a obtener los materiales

export function useAdminThickness(refect?: () => void) {
    const addThicknessMutation = useAddThickness();
    const changeThicknessMutation = useChangeThickness();
    const deleteThicknessMutation = useDeleteThickness();

    const onDelete = useCallback(async (id: number | null) => {
        if (id) {
            const toastId = toast.loading("Eliminando...");
            try {
                await deleteThicknessMutation.mutateAsync(id);
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
    }, [deleteThicknessMutation, refect]);

    const onEdit = useCallback(async (id: number | null, data: Thickness) => {
        if (!id) return;
        const toastId = toast.loading("Editando grosor...");
        try {
            await changeThicknessMutation.mutateAsync({ thicknessId: id, thickness: data });
            toast.success("Grosor editado", { id: toastId });
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar material", { id: toastId });
            return;
        }

    }, [changeThicknessMutation, refect]);

    const onSave = useCallback(async (data: Thickness) => {
        const toastId = toast.loading("Guardando grosor...");
        try {
            await addThicknessMutation.mutateAsync({ thickness: data });
            toast.success("Grosor guardado", { id: toastId });
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar material", { id: toastId });
        }
    }, [addThicknessMutation, refect]);

    return {
        onSave,
        onEdit,
        onDelete,
        status: {
            isLoading: addThicknessMutation.status === "pending" || changeThicknessMutation.status === "pending",
            isError: addThicknessMutation.status === "error" || changeThicknessMutation.status === "error",
            isSuccess: addThicknessMutation.status === "success" || changeThicknessMutation.status === "success",
            error: (addThicknessMutation as any).error ?? (changeThicknessMutation as any).error,
        },
    };
}