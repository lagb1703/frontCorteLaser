import { useAddMaterial, useChangeMaterial, useDeleteMaterial } from "@/materialModule/hooks";
import { materialSchema, type Material } from "@/materialModule/validators/materialValidators";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react";

const refectTimeout = 100; //para el futuro, esto lo hice para que de tiempo a que el backend procese la solicitud antes de volver a obtener los materiales

export function useAdminMaterial(material: Material | null, refect?: () => void) {
    const {
        register,
        handleSubmit,
        formState,
        reset,
    } = useForm<Material>({
        resolver: zodResolver(materialSchema) as Resolver<Material>,
        mode: "onChange",
        defaultValues: material ?? {},
    })
    const addMaterialMutation = useAddMaterial();
    const changeMaterialMutation = useChangeMaterial();
    const deleteMaterialMutation = useDeleteMaterial();

    const onDelete = useCallback(async () => {
        if (material) {
            try {
                await deleteMaterialMutation.mutateAsync(material.materialId!);
            } finally {
                setTimeout(() => {
                    if (refect) {
                        refect();
                    }
                }, refectTimeout);
            }
        }
    }, [material, deleteMaterialMutation, refect]);

    const onSubmit = useCallback(async (data: Material) => {
        if (material) {
            await changeMaterialMutation.mutateAsync({ materialId: material.materialId!, material: data });
        } else {
            await addMaterialMutation.mutateAsync(data);
            reset();
            setTimeout(() => {
                if (refect) {
                    refect();
                }
            }, refectTimeout);
        }
    }, [material, addMaterialMutation, changeMaterialMutation, reset, refect]);

    return {
        register,
        handleSubmit:handleSubmit(onSubmit),
        onDelete,
        formState,
        status: {
            isLoading: addMaterialMutation.status === "pending" || changeMaterialMutation.status === "pending",
            isError: addMaterialMutation.status === "error" || changeMaterialMutation.status === "error",
            isSuccess: addMaterialMutation.status === "success" || changeMaterialMutation.status === "success",
            error: (addMaterialMutation as any).error ?? (changeMaterialMutation as any).error,
        },
    };
}