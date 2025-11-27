import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetImage(fileId: string | number): UseQueryResult<Blob, unknown> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<Blob, unknown>({
        queryKey: ["file", fileId, "image"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await fileService.current.getImage(fileId);
        },
        staleTime: Infinity,
    });
}