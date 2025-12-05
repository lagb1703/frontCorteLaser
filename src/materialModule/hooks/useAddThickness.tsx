import { MaterialService } from "../services/materialService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {type Thickness} from "../validators/thicknessValidators";
import { useRef } from "react";

export function useAddThickness(): UseMutationResult<string, unknown, { thickness: Thickness }> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useMutation<string, unknown, { thickness: Thickness }>({
        mutationFn: async ({ thickness }: { thickness: Thickness }) => {
            return await materialService.current.addNewThickness(thickness);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el material, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            throw error;
        },
    });
}