import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetFile(id: string | number): UseQueryResult<Blob, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<Blob, Error>({
        queryKey: ["file", id],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await fileService.current.getFile(id);
        },
        staleTime: Infinity,
    });
}