import { useAddThickness, useChangeThickness, useDeleteThickness } from "@/materialModule/hooks";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react";
import { thicknessSchema, type Thickness } from "@/materialModule/validators/thicknessValidators";

const refectTimeout = 100; //para el futuro, esto lo hice para que de tiempo a que el backend procese la solicitud antes de volver a obtener los materiales

export function useAdminThickness(thickness: Thickness | null, refect?: () => void) {
    const {
        register,
        handleSubmit,
        formState,
        reset,
    } = useForm<Thickness>({
        resolver: zodResolver(thicknessSchema) as Resolver<Thickness>,
        mode: "onChange",
        defaultValues: thickness ?? {},
    })
    const addThicknessMutation = useAddThickness();
    const changeThicknessMutation = useChangeThickness();
    const deleteThicknessMutation = useDeleteThickness();

    const onDelete = useCallback(async () => {
        if (thickness) {
            try {
                await deleteThicknessMutation.mutateAsync(thickness.thicknessId!);
            } finally {
                setTimeout(() => {
                    if (refect) {
                        refect();
                    }
                }, refectTimeout);
            }
        }
    }, [thickness, deleteThicknessMutation, refect]);

    const onSubmit = useCallback(async (data: Thickness) => {
        delete data.lastModification;
        if (thickness) {
            await changeThicknessMutation.mutateAsync({ thicknessId: thickness.thicknessId!, thickness: data });
        } else {
            await addThicknessMutation.mutateAsync({ thickness: data });
            reset();
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        }
    }, [thickness, addThicknessMutation, changeThicknessMutation, reset, refect]);

    return {
        register,
        handleSubmit:handleSubmit(onSubmit),
        onDelete,
        formState,
        status: {
            isLoading: addThicknessMutation.status === "pending" || changeThicknessMutation.status === "pending",
            isError: addThicknessMutation.status === "error" || changeThicknessMutation.status === "error",
            isSuccess: addThicknessMutation.status === "success" || changeThicknessMutation.status === "success",
            error: (addThicknessMutation as any).error ?? (changeThicknessMutation as any).error,
        },
    };
}