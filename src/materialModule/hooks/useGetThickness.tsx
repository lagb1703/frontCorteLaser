import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { MaterialService } from "../services/materialService";
import { type Thickness } from "../validators/thicknessValidators";
import { useRef } from "react";

export function useGetThickness(): UseQueryResult<Array<Thickness>, unknown> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useQuery<Array<Thickness>, unknown, Array<Thickness>>({
        queryKey: ["thickness"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await materialService.current.getAllThickness();
        },
        staleTime: 2 * 60 * 1000,
    });
}