import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetPriceCalculator(): UseQueryResult<string, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<string, Error>({
        queryKey: ["file", "priceCalculator"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await fileService.current.getPriceEstimate();
        },
    });
}