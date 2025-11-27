import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useSaveFile(): UseMutationResult<string | number, Error, Blob> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useMutation<string | number, Error, Blob>({
        mutationFn: async (file: Blob) => {
            return await fileService.current.saveFile(file);
        }
    });
}