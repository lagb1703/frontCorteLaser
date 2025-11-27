import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type PriceResponse } from "../validators/priceValidator";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetPrice(id: string | number, materialId: string | number | null, thicknessId: string | number | null): UseQueryResult<PriceResponse, Error> {
    const fileService = useRef<FileService>(FileService.getInstance());
    return useQuery<PriceResponse, Error>({
        queryKey: ["file", id, "price", materialId, thicknessId],
        enabled: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            if (materialId === null || thicknessId === null) {
                return { price: 0, quoteId: 0 };
            }
            return await fileService.current.getPrice(id, materialId, thicknessId);
        },
    });
}