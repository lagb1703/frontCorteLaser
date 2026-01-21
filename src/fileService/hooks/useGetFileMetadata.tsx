import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";
import type { FileDb } from "../validators/fileValidator";

export function useGetFileMetadata(id: string | number): UseQueryResult<FileDb, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<FileDb, Error>({
        queryKey: ["fileMetadata", id],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            if( id === null || id === undefined ) {
                return {
                    id: 0,
                    name: "",
                    md5: "",
                    bucket: "",
                    date: new Date(),
                }
            }
            return await fileService.current.getFileMetadata(id);
        },
        staleTime: Infinity,
    });
}