import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useChangeSpeedMaterialThickness(): UseMutationResult<void, unknown, { materialId: string | number; thicknessId: string | number; speed: number }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { materialId: string | number; thicknessId: string | number; speed: number }>({
        mutationFn: async ({ materialId, thicknessId, speed }: { materialId: string | number; thicknessId: string | number; speed: number }) => {
            return await materialService.current.changeSpeedMaterialThickness(materialId, thicknessId, speed);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de cambiar la velocidad, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al cambiar la velocidad del material-thickness:", error);
        },
    });
}