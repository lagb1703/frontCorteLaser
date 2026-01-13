import ShapeTable from "../components/shapeTable";
import ResumeAll from "../components/resumeAll";
import { useContext, useState, useCallback } from "react";
import { MultifileContext } from "@/utilities/global/multifileContext";
import type { PriceInterface } from "../interfaces/prices";
import {
    useGetMaterials,
    useGetThicknessByMaterialId
} from "@/materialModule/hooks";
import Quoter from "../components/quoter";
import { useQuoter } from "../hooks";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

export default function QuoterManyPage() {
    const { data: materials } = useGetMaterials();
    const { materialId, thicknessId, setMaterialId, setThicknessId } = useQuoter();
    const { data: thicknesses } = useGetThicknessByMaterialId(materialId);
    const { filesIds } = useContext(MultifileContext);
    const [prices, setPrices] = useState<PriceInterface[]>(filesIds.map((id) => ({ fileId: id, materialId: 0, thicknessId: 0, amount: 0, price: 0 })));
    const setPrice = useCallback((prices: PriceInterface) => {
        setPrices((prevPrices) => {
            const existingPriceIndex = prevPrices.findIndex((p) => p.fileId === prices.fileId);
            if (existingPriceIndex !== -1) {
                const updatedPrices = [...prevPrices];
                updatedPrices[existingPriceIndex] = prices;
                return updatedPrices;
            } else {
                return [...prevPrices, prices];
            }
        });
    }, [setPrices]);
    return (
        <div className="p-4 h-full flex flex-col justify-around">
            <h1 className="text-2xl font-bold mb-4">Cotizar archivos</h1>
            <div
                className="flex justify-around items-center p-1 flex-wrap">
                <h2 className="text-xl font-bold mb-3">Cotizar todos: </h2>
                <div
                    className="basis-2/3">
                    <Quoter
                        materials={materials!}
                        materialId={materialId!}
                        setMaterialId={setMaterialId}
                        thicknessId={thicknessId!}
                        setThicknessId={setThicknessId}
                        thicknesses={thicknesses || []}
                    />
                </div>
            </div>
            <div
                className="w-full flex justify-around items-center flex-wrap">
                <div
                    className="h-full basis-[75%] overflow-auto">
                    <ShapeTable 
                        filesIds={filesIds} 
                        setPrice={setPrice} 
                        materialId={materialId!}
                        thicknessId={thicknessId!}
                        />
                </div>
                <div
                    className="h-full min-h-[50vh] basis-[20%] ml-4">
                    <ResumeAll prices={prices} />
                </div>
            </div>
        </div>
    );
}