import { MaterialService } from "../services/materialService";
import { type Material } from "../validators/materialValidators";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useGetMaterialById(id: string): UseQueryResult<Material, unknown> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useQuery<Material, unknown>({
        queryKey: ["materials", id],
        queryFn: async () => {
            return await materialService.current.getMaterialById(id);
        },
    });
}