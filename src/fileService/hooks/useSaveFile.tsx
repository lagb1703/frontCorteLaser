import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useSaveFile(): UseMutationResult<string | number, Error, FormData> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useMutation<string | number, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            return await fileService.current.saveFile(formData);
        },
        onError: (error: Error) => {
            console.error('Error saving file:', error);
        }
    });
}