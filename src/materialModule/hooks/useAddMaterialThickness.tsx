import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useAddMaterialThickness(): UseMutationResult<void, unknown, { materialId: string; thicknessId: string }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { materialId: string; thicknessId: string }>({
        mutationFn: async ({ materialId, thicknessId }: { materialId: string; thicknessId: string }) => {
            return await materialService.current.addMaterialThickness(materialId, thicknessId);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}