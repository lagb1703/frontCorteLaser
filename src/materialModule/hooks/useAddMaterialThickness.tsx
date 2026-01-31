import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useAddMaterialThickness(): UseMutationResult<void, unknown, { materialId: string | number; thicknessId: string | number; speed: number }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { materialId: string | number; thicknessId: string | number; speed: number }>({
        mutationFn: async ({ materialId, thicknessId, speed }: { materialId: string | number; thicknessId: string | number; speed: number }) => {
            return await materialService.current.addMaterialThickness(materialId, thicknessId, speed);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}