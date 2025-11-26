import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useDeleteThickness(): UseMutationResult<void, unknown, string | number> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, string | number>({
        mutationFn: async (thicknessId: string | number) => {
            await materialService.current.deleteThickness(thicknessId);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}