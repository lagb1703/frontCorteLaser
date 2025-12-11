import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";
import { type FileDb } from "../validators/fileValidator";

export function useGetAllUserFile(): UseQueryResult<Array<FileDb>, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<Array<FileDb>, Error>({
        queryKey: ["userFiles"],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await fileService.current.getAllUserInfoFiles();
        },
        staleTime: 10000,
    });
}