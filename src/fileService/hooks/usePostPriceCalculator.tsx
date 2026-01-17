import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function usePostPriceCalculator(): UseMutationResult<string | number, Error, string> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useMutation<string | number, Error, string>({
        mutationFn: async (expression: string) => {
            return await fileService.current.setPriceCalculator(expression);
        },
        onError: (error: Error) => {
            console.error(error);
            throw error;
        }
    });
}