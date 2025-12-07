import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { useMemo } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface props {
    materialId: string | number;
    thicknessId: string | number;
    materials: Material[];
    thicknesses: Thickness[];
    amount: number;
    price: number;
}

export default function Resume({ materialId, thicknessId, materials, thicknesses, amount, price }: props) {
    const material = useMemo(
        () => materials.find((mat) => String(mat.materialId) === String(materialId)),
        [materials, materialId]
    );
    const thickness = useMemo(
        () => thicknesses.find((thick) => String(thick.thicknessId) === String(thicknessId)),
        [thicknesses, thicknessId]
    );

    const fmt = (n?: number) =>
        n == null ? "No especificado" : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <Card className="w-full max-w-lg md:max-w-[97%] mx-auto mt-1">
            <CardHeader>
                <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Material</p>
                        <p className="font-medium">{material?.name ?? "No especificado"}</p>
                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">Precio Material</p>
                            <Badge>{material?.price != null ? fmt(material.price) : "No especificado"}</Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Espesura</p>
                        <p className="font-medium">{thickness?.name ?? "No especificado"}</p>
                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">Precio Espesura</p>
                            <Badge variant="secondary">{thickness?.price != null ? fmt(thickness.price) : "No especificado"}</Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Cantidad</p>
                        <p className="font-medium">{amount ?? "No especificado"}</p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Precio total</p>
                    <div className="text-lg font-semibold">{fmt(price)}</div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">Los precios mostrados son referenciales.</div>
            </CardFooter>
        </Card>
    );
}