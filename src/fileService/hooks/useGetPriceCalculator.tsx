import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type PriceResponse } from "../validators/priceValidator";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetPriceCalculator(): UseQueryResult<PriceResponse, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<PriceResponse, Error>({
        queryKey: ["file", "priceCalculator"],
        enabled: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await fileService.current.getPriceEstimate();
        },
    });
}