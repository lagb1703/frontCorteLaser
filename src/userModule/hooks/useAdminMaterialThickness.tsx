import {
    useGetThicknessByMaterialId,
    useGetThicknessNoLinkedToMaterialId,
    useAddMaterialThickness,
    useDeleteMaterialThickness,
    useChangeSpeedMaterialThickness,
    useChangePriceMaterialThickness
} from "@/materialModule/hooks";
import { useState, useEffect, useCallback } from "react";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { toast } from "sonner";

const refectTimeOut = 100; // 5 seconds

export function useAdminMaterialThickness() {
    const [materialId, setMaterialId] = useState<number | null>(null);
    const [linkedThicknesses, setLinkedThicknesses] = useState<string[]>([]);
    const [unlinkedThicknesses, setUnlinkedThicknesses] = useState<string[]>([]);
    const { data: thicknessesLinked, refetch: refetchLinked } = useGetThicknessByMaterialId(materialId ?? 0);
    const { data: thicknessesUnlinked, refetch: refetchUnlinked } = useGetThicknessNoLinkedToMaterialId(materialId ?? 0);
    const changeSpeedMaterialThickness = useChangeSpeedMaterialThickness();
    const changePriceMaterialThickness = useChangePriceMaterialThickness();
    useEffect(() => {
        if (thicknessesLinked) {
            const linked = thicknessesLinked.map(thickness => JSON.stringify(thickness));
            setLinkedThicknesses(linked);
        }
        if (thicknessesUnlinked) {
            const unlinked = thicknessesUnlinked.map(thickness => JSON.stringify(thickness));
            setUnlinkedThicknesses(unlinked);
        }
    }, [materialId, thicknessesLinked, thicknessesUnlinked]);
    const addMaterialThickness = useAddMaterialThickness();
    const deleteMaterialThickness = useDeleteMaterialThickness();
    const handleAddThickness = useCallback(async (thickness: Thickness | string) => {
        if (materialId !== null) {
            const thicknessId = typeof thickness === 'string' ? JSON.parse(thickness).thicknessId : thickness.thicknessId;
            await addMaterialThickness.mutateAsync({ materialId, thicknessId: thicknessId, speed: 0 });
            setTimeout(() => {
                refetchLinked();
                refetchUnlinked();
            }, refectTimeOut);
        }
    }, [materialId, addMaterialThickness, refetchLinked, refetchUnlinked]);
    const handleChangeSpeed = useCallback(async (thicknessId: string | number, speed: number) => {
        if (materialId === null)
            return
        if(speed <= 0){
            toast.error("La velocidad debe ser mayor a 0");
            return;
        }
        const id = toast.loading("Cambiando velocidad...");
        try {
            await changeSpeedMaterialThickness.mutateAsync({ materialId, thicknessId, speed });
            toast.success("Velocidad cambiada correctamente", { id });
        } catch (e) {
            toast.error("Error al cambiar la velocidad", { id });
        }
    }, [changeSpeedMaterialThickness, materialId]);
    const handleChangePrice = useCallback(async (thicknessId: string | number, price: number) => {
        if (materialId === null)
            return
        if(price <= 0){
            toast.error("La velocidad debe ser mayor a 0");
            return;
        }
        const id = toast.loading("Cambiando velocidad...");
        try {
            await changePriceMaterialThickness.mutateAsync({ materialId, thicknessId, price });
            toast.success("Precio cambiado correctamente", { id });
        } catch (e) {
            toast.error("Error al cambiar el Precio", { id });
        }
    }, [changePriceMaterialThickness, materialId]);
    const handleDeleteThickness = useCallback(async (thickness: Thickness | string) => {
        if (materialId !== null) {
            const thicknessId = typeof thickness === 'string' ? JSON.parse(thickness).thicknessId : thickness.thicknessId;
            await deleteMaterialThickness.mutateAsync({ materialId, thicknessId: thicknessId });
            setTimeout(() => {
                refetchLinked();
                refetchUnlinked();
            }, refectTimeOut);
        }
    }, [materialId, deleteMaterialThickness, refetchLinked, refetchUnlinked]);
    return {
        materialId,
        setMaterialId,
        linkedThicknesses,
        unlinkedThicknesses,
        handleAddThickness,
        handleDeleteThickness,
        handleChangeSpeed,
        handleChangePrice
    };
}