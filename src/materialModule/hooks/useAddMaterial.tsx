import { MaterialService } from "../services/materialService";
import { type Material } from "../validators/materialValidators";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useAddMaterial(): UseMutationResult<string, unknown, Material> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<string, unknown, Material>({
        mutationFn: async (material: Material) => {
            return await materialService.current.addNewMaterial(material);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}