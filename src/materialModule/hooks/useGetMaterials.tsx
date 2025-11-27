import { MaterialService } from "../services/materialService";
import { type Material } from "../validators/materialValidators";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useGetMaterials(): UseQueryResult<Array<Material>, unknown> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useQuery<Array<Material>, unknown>({
        queryKey: ["materials"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            return await materialService.current.getAllMaterials();
        },
        staleTime: 2 * 60 * 1000,
    });
}