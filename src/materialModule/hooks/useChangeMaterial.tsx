import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type Material } from "../validators/materialValidators";
import { useRef } from "react";

export function useChangeMaterial(): UseMutationResult<void, unknown, { materialId: string | number; material: Material }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { materialId: string | number; material: Material }>({
        mutationFn: async ({ materialId, material }: { materialId: string | number; material: Material }) => {
            console.log("Changing material", materialId, material);
            return await materialService.current.changeMaterial(materialId, material);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}