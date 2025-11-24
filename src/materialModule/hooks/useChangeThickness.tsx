import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type Thickness } from "../validators/thicknessValidators";
import { useRef } from "react";

export function useChangeThickness(): UseMutationResult<void, unknown, { thicknessId: string; thickness: Thickness }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<void, unknown, { thicknessId: string; thickness: Thickness }>({
        mutationFn: async ({ thicknessId, thickness }: { thicknessId: string; thickness: Thickness }) => {
            return await materialService.current.changeThickness(thicknessId, thickness);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}