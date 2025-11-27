import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { useMemo } from "react";
interface props {
    materialId: string | number;
    thicknessId: string | number;
    materials: Material[];
    thicknesses: Thickness[];
    price: number;
}

export default function Resume({ materialId, thicknessId, materials, thicknesses, price }: props) {
    const material = useMemo(
        () => materials.find(mat => String(mat.materialId) === String(materialId)),
        [materials, materialId]
    );
    const thickness = useMemo(
        () => thicknesses.find(thick => String(thick.thicknessId) === String(thicknessId)),
        [thicknesses, thicknessId]
    );
    return (
        <div>
            <p>Material: {material?.name ?? "No especificado"}</p>
            <p>Precio Material: {material?.price ?? "No especificado"}</p>
            <p>Espessura: {thickness?.name ?? "No especificado"}</p>
            <p>Precio Espessura: {thickness?.price ?? "No especificado"}</p>
            <p>Precio: {price}</p>
        </div>
    );
}