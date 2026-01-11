import ShapeTable from "../components/shapeTable";
import ResumeAll from "../components/resumeAll";
import { useContext, useState, useCallback } from "react";
import { MultifileContext } from "@/utilities/global/multifileContext";
import type { PriceInterface } from "../interfaces/prices";

export default function QuoterManyPage() {
    const {filesIds} = useContext(MultifileContext);
    const [prices, setPrices] = useState<PriceInterface[]>(filesIds.map((id) => ({ fileId: id, price: 0 })));
    const setPrice = useCallback((fileId: string | number, price: number) => {
        setPrices((prevPrices) => {
            const existingPriceIndex = prevPrices.findIndex((p) => p.fileId === fileId);
            if (existingPriceIndex !== -1) {
                const updatedPrices = [...prevPrices];
                updatedPrices[existingPriceIndex] = { fileId, price };
                return updatedPrices;
            } else {
                return [...prevPrices, { fileId, price }];
            }
        });
    }, [setPrices]);
    return (
        <div className="p-4 h-full">
            <h1 className="text-2xl font-bold mb-4">Quoter Many Files</h1>
            <div
                className="h-full w-full flex justify-around items-center">
                <div
                    className="h-full max-h-[50vh] basis-[75%] overflow-auto">
                    <ShapeTable filesIds={filesIds} setPrice={setPrice} />
                </div>
                <div
                    className="h-full max-h-[50vh] basis-[20%] ml-4">
                    <ResumeAll prices={prices} />
                </div>
            </div>
        </div>
    );
}