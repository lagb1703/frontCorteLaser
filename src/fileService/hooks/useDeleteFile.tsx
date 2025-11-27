import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useDeleteFile(): UseMutationResult<void, unknown, string | number> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useMutation<void, unknown, string | number>({
        mutationFn: async (fileId: string | number) => {
            return await fileService.current.deleteFile(fileId);
        },
        onSuccess: () => {
            // Aquí puedes agregar lógica adicional después de eliminar el archivo, como invalidar cachés o mostrar notificaciones.
        },
        onError: (error) => {
            console.error("Error al eliminar el archivo:", error);
        },
    });
}