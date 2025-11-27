import { MaterialService } from "../services/materialService";
import { type Thickness } from "../validators/thicknessValidators";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export function useGetThicknessNoLinkedToMaterialId(id: string | number): UseQueryResult<Array<Thickness>, unknown> {
    const materialService = useRef<MaterialService>(MaterialService.getInstance());
    return useQuery<Array<Thickness>, unknown>({
        queryKey: ["noLinked", "thickness", id],
        queryFn: async () => {
            return await materialService.current.getThicknessNoLinkedToMaterial(id);
        },
    });
}