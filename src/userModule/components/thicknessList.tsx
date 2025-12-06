import { useAdminThickness } from "../hooks";
import { useGetThickness, useGetMaterials } from "@/materialModule/hooks";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { ItemTable } from "./table";

export default function ThicknessList() {
    const { data: thicknesses, isLoading, refetch } = useGetThickness();
    return (
        <div>
            <ItemTable data={thicknesses || []} idName="thicknessId" refetch={refetch} useAdminData={useAdminThickness} />
        </div>
    );
}