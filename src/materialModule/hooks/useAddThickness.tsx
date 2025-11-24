import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {type Thickness} from "../validators/thicknessValidators";
import { useRef } from "react";

export function useAddThickness(): UseMutationResult<string, unknown, { thickness: Thickness, materialId: string }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<string, unknown, { thickness: Thickness, materialId: string }>({
        mutationFn: async ({ thickness, materialId }: { thickness: Thickness, materialId: string }) => {
            return await materialService.current.addNewThickness(thickness, materialId);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el material:", error);
        },
    });
}