import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useChangePriceMaterialThickness(): UseMutationResult<void, unknown, { materialId: string | number; thicknessId: string | number; price: number }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { materialId: string | number; thicknessId: string | number; price: number }>({
        mutationFn: async ({ materialId, thicknessId, price }: { materialId: string | number; thicknessId: string | number; price: number }) => {
            return await materialService.current.changePriceMaterialThickness(materialId, thicknessId, price);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de cambiar la velocidad, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al cambiar la velocidad del material-thickness:", error);
        },
    });
}