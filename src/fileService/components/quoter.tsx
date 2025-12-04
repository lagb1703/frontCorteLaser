import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { useCallback } from "react";
interface props {
    materials: Array<Material>;
    materialId: string | number | null;
    setMaterialId: (id: string | number) => void;
    thicknesses: Array<Thickness>;
    thicknessId: string | number | null;
    setThicknessId: (id: string | number) => void;
}

export default function Quoter({ materials, materialId, setMaterialId, thicknesses, thicknessId, setThicknessId }: props) {
    const handleMaterialChange = useCallback((id: string | number) => {
        setMaterialId(id);
    }, [setMaterialId]);

    const handleThicknessChange = useCallback((id: string | number) => {
        setThicknessId(id);
    }, [setThicknessId]);

    return (
        <div>
            <select
                defaultValue={materialId ?? ""}
                onChange={(e) => handleMaterialChange(e.target.value)}
            >
                <option value="" hidden>Select Material</option>
                {materials?.map((material) => (
                    <option key={material.materialId} value={material.materialId!}>
                        {material.name}
                    </option>
                ))}
            </select>
            <select
                defaultValue={thicknessId ?? "p"}
                onChange={(e) => handleThicknessChange(e.target.value)}
            >
                <option value="p" hidden>Select Thickness</option>
                {thicknesses?.map((thickness) => (
                    <option key={thickness.thicknessId} value={thickness.thicknessId!}>
                        {thickness.name}
                    </option>
                ))}
            </select>
        </div>
    );
}