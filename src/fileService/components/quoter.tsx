import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { useCallback } from "react";
interface props {
    materials: Array<Material>;
    setMaterialId: (id: string | number) => void;
    thicknesses: Array<Thickness>;
    setThicknessId: (id: string | number) => void;
}

export default function Quoter({ materials, setMaterialId, thicknesses, setThicknessId }: props) {
    const handleMaterialChange = useCallback((id: string | number) => {
        console.log("Material ID selected:", id);
        setMaterialId(id);
    }, [setMaterialId]);

    const handleThicknessChange = useCallback((id: string | number) => {
        console.log("Thickness ID selected:", id);
        setThicknessId(id);
    }, [setThicknessId]);

    return (
        <div>
            <select
                defaultValue=""
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
                defaultValue=""
                onChange={(e) => handleThicknessChange(e.target.value)}
            >
                <option value="" hidden>Select Thickness</option>
                {thicknesses?.map((thickness) => (
                    <option key={thickness.thicknessId} value={thickness.thicknessId!}>
                        {thickness.name}
                    </option>
                ))}
            </select>
        </div>
    );
}