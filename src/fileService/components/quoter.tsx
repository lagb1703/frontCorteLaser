import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";

interface props {
    materials: Array<Material>;
    materialId: string | number | null;
    disableMaterialChange?: boolean;
    setMaterialId: (id: string | number) => void;
    thicknesses: Array<Thickness>;
    thicknessId: string | number | null;
    disableThicknessChange?: boolean;
    setThicknessId: (id: string | number) => void;
    amount?: number | null;
    setAmount?: (amount: number) => void;
}

export default function Quoter({ materials, materialId, setMaterialId, thicknesses, thicknessId, setThicknessId, amount, setAmount, disableMaterialChange, disableThicknessChange }: props) {
    const handleMaterialChange = useCallback((id: string | number) => {
        setMaterialId(id);
    }, [setMaterialId]);

    const handleThicknessChange = useCallback((id: string | number) => {
        setThicknessId(id);
    }, [setThicknessId]);

    return (
        <div
            className="flex flex-wrap min-h-[250px] md:min-h-[150px] lg:min-h-auto justify-between items-center py-4 px-5">
            <Select
                value={materialId != null ? String(materialId) : ""}
                onValueChange={(val) => handleMaterialChange(val)}
                disabled={!!disableMaterialChange}
            >
                <SelectTrigger className="basis-full md:basis-[48%] lg:basis-[32%]">
                    <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Materials</SelectLabel>
                        {materials?.map((material) => (
                            <SelectItem key={material.materialId} value={String(material.materialId!)}>
                                {material.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={thicknessId != null ? String(thicknessId) : ""}
                onValueChange={(val) => handleThicknessChange(val)}
                disabled={!!disableThicknessChange}
            >
                <SelectTrigger className="basis-full md:basis-[48%] lg:basis-[32%]">
                    <SelectValue placeholder="Select Thickness" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Thicknesses</SelectLabel>
                        {thicknesses?.map((thickness) => (
                            <SelectItem key={thickness.thicknessId} value={String(thickness.thicknessId!)}>
                                {thickness.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {amount !== undefined && setAmount !== undefined && (
                <Input
                    type="number"
                    className="basis-full md:basis-auto lg:basis-[32%]"
                    placeholder="Amount"
                    value={amount ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = parseInt(val);
                        if (isNaN(num)) {
                            return;
                        }
                        if (num < 0) {
                            return;
                        }
                        setAmount(num);
                    }}
                />
            )}
        </div>
    );
}