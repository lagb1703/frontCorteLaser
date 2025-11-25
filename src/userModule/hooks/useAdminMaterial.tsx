import { useAddMaterial, useChangeMaterial } from "@/materialModule/hooks";
import { materialSchema, type Material } from "@/materialModule/validators/materialValidators";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react";

export function useAdminMaterial(material: Material | null) {
    const {
        register,
        handleSubmit,
        formState,
    } = useForm<Material>({
        resolver: zodResolver(materialSchema) as Resolver<Material>,
        mode: "onChange",
        defaultValues: material ?? {},
    })
    const addMaterialMutation = useAddMaterial();
    const changeMaterialMutation = useChangeMaterial();

    const onSubmit = useCallback((data: Material) => {
        if (material) {
            changeMaterialMutation.mutate({ materialId: material.materialId!, material: data });
        } else {
            addMaterialMutation.mutate(data);
        }
    }, [material, addMaterialMutation, changeMaterialMutation]);

    return {
        register,
        handleSubmit:handleSubmit(onSubmit),
        formState,
        status: {
            isLoading: addMaterialMutation.status === "pending" || changeMaterialMutation.status === "pending",
            isError: addMaterialMutation.status === "error" || changeMaterialMutation.status === "error",
            isSuccess: addMaterialMutation.status === "success" || changeMaterialMutation.status === "success",
            error: (addMaterialMutation as any).error ?? (changeMaterialMutation as any).error,
        },
    };
}