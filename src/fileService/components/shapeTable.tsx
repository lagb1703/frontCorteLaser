import { useGetFileMetadata, useGetPrice, useGetImage, useQuoter } from "../hooks";
import { useGetMaterials, useGetThicknessByMaterialId } from "@/materialModule/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import ImageVisualizer from "./imageVisualizer";
import Quoter from "./quoter";
import type { Material } from "@/materialModule/validators/materialValidators";

interface ShapeItemProps {
    fileId: string;
    materials: Array<Material>;
    setPrice: (fileId: string | number, price: number) => void;
    materialGeneralId?: string | number;
    thicknessGeneralId?: string | number;
}
function ShapeItem({ fileId, materials, setPrice, materialGeneralId, thicknessGeneralId }: ShapeItemProps) {
    const { data: imageData, isLoading: isImageLoading } = useGetImage(fileId);
    const { data: fileMetadata, isLoading: isMetadataLoading } = useGetFileMetadata(fileId);
    const { materialId, thicknessId, amount, setMaterialId, setThicknessId, setAmount } = useQuoter();
    const { data: thicknesses } = useGetThicknessByMaterialId(materialGeneralId || materialId!);
    const { data: priceData, refetch } = useGetPrice(fileId, materialGeneralId || materialId!, thicknessGeneralId || thicknessId!, amount!);
    useEffect(() => {
        if (priceData) {
            setPrice(fileId, priceData.price);
        }
    }, [priceData, fileId, setPrice]);
    useEffect(()=>{
        refetch();
    }, [materialId, thicknessId, amount]);
    return (
        <li
            className="">
            <div className="flex items-center justify-around flex-wrap p-4 border rounded-lg shadow-md">
                <div
                    className="h-22 basis-1/10 flex items-center justify-center">
                    {isImageLoading ? (
                        <Skeleton className="h-20 w-20 rounded-full" />
                    ) : (
                        <ImageVisualizer image={imageData!} />
                    )}
                </div>
                <div
                    className="basis-1/10 overflow-clip text-center">
                    {
                        (!isMetadataLoading) ?
                            fileMetadata?.name :
                            <Skeleton className="h-20 w-20 rounded-full" />
                    }
                </div>
                <div
                    className="basis-7/10">
                    <Quoter
                        materials={materials}
                        materialId={materialGeneralId || materialId!}
                        setMaterialId={setMaterialId}
                        thicknessId={thicknessGeneralId || thicknessId!}
                        setThicknessId={setThicknessId}
                        amount={amount!}
                        setAmount={setAmount}
                        thicknesses={thicknesses || []}
                        disableMaterialChange={!!materialGeneralId}
                        disableThicknessChange={!!thicknessGeneralId}
                    />
                </div>
                <div
                    className="basis-1/10">{(priceData) ? priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</div>
            </div>
        </li>
    );
}

export interface ShapeTableProps {
    filesIds: Array<string>;
    setPrice: (fileId: string | number, price: number) => void;
    materialId?: string | number;
    thicknessId?: string | number;
}
export default function ShapeTable({ filesIds, setPrice, materialId, thicknessId }: ShapeTableProps) {
    const { data: materialsData } = useGetMaterials();
    console.log(materialId, thicknessId);
    return (
        <ul className="space-y-4">
            {filesIds.map((fileId) => (
                <ShapeItem
                    key={fileId}
                    fileId={fileId}
                    materials={materialsData || []}
                    setPrice={setPrice}
                    materialGeneralId={materialId}
                    thicknessGeneralId={thicknessId}
                />
            ))}
        </ul>
    );
}