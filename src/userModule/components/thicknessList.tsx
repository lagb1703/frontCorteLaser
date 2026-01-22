import { useAdminThickness } from "../hooks";
import { useGetThickness } from "@/materialModule/hooks";
import { ItemTable } from "./table";

export default function ThicknessList() {
    const { data: thicknesses, refetch } = useGetThickness();
    return (
        <div>
            <ItemTable data={thicknesses || []} idName="thicknessId" refetch={refetch} useAdminData={useAdminThickness} />
        </div>
    );
}