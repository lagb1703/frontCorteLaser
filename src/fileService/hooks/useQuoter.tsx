import { useState } from "react";

export function useQuoter(){
    const [materialId, setMaterialId] = useState<number | string | null>(null);
    const [thicknessId, setThicknessId] = useState<number | string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    return { materialId, setMaterialId, thicknessId, setThicknessId, amount, setAmount };
}