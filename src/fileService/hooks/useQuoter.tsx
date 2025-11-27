import { useState } from "react";

export function useQuoter(){
    const [materialId, setMaterialId] = useState<number | string | null>(null);
    const [thicknessId, setThicknessId] = useState<number | string | null>(null);
    return { materialId, setMaterialId, thicknessId, setThicknessId };
}