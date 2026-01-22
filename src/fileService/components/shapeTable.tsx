import { useGetFileMetadata, useGetPrice, useGetImage, useQuoter } from "../hooks";
import { useGetMaterials, useGetThicknessByMaterialId } from "@/materialModule/hooks";
import type { PriceInterface } from "../interfaces/prices";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import ImageVisualizer from "./imageVisualizer";
import Quoter from "./quoter";
import type { Material } from "@/materialModule/validators/materialValidators";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface ShapeItemProps {
    fileId: string;
    materials: Array<Material>;
    setPrice: (prices: PriceInterface) => void;
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
            setPrice({ fileId, materialId: materialGeneralId || materialId!, thicknessId: thicknessGeneralId || thicknessId!, amount: amount!, price: priceData.price });
        }
    }, [priceData, fileId, setPrice]);
    useEffect(() => {
        refetch();
    }, [materialId, thicknessId, amount]);
    return (
        <li
            className="">
            <Card>
                <CardHeader
                    className="w-full justify-start h-auto">
                    <div
                        className="flex w-full items-center gap-4">
                        <div
                            className="shrink-0 flex justify-center items-center p-2">
                            <CardTitle className="text-center whitespace-nowrap">Archivo Cotizado:</CardTitle>
                        </div>
                        <div
                            className="grow text-left">
                            {
                                (!isMetadataLoading) ?
                                    <span className="break-all">{fileMetadata?.name}</span> :
                                    <Skeleton className="h-6 w-full rounded-full" />
                            }
                        </div>
                    </div>
                </CardHeader>
                <CardContent
                    className="flex items-center justify-around flex-wrap p-4">
                    <div
                        className="basis-full lg:h-22 lg:basis-1/10 flex items-center justify-center">
                        {isImageLoading ? (
                            <Skeleton className="h-20 w-20 rounded-full" />
                        ) : (
                            <ImageVisualizer image={imageData!} />
                        )}
                    </div>
                    <div
                        className="basis-full lg:basis-7/10">
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
                        className="basis-full lg:basis-1/10">
                        <span className="font-bold text-lg">
                            precio: $
                            {(priceData) ? priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                        </span>
                        </div>
                </CardContent>
            </Card>
        </li>
    );
}

export interface ShapeTableProps {
    filesIds: Array<string>;
    setPrice: (prices: PriceInterface) => void;
    materialId?: string | number;
    thicknessId?: string | number;
}
export default function ShapeTable({ filesIds, setPrice, materialId, thicknessId }: ShapeTableProps) {
    const { data: materialsData } = useGetMaterials();
    return (
        <ul className="space-y-4 w-full">
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