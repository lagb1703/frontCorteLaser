import { MaterialService } from "../services/materialService";
import { type Thickness } from "../validators/thicknessValidators";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useGetThicknessByMaterialId(id: string | number | null): UseQueryResult<Array<Thickness>, unknown> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useQuery<Array<Thickness>, unknown>({
        queryKey: ["thickness", id],
        queryFn: async () => {
            if (id === null) {
                return [];
            }
            return await materialService.current.getThicknessByMaterial(id);
        },
    });
}