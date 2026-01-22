import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { ItemTable } from "./table";

export default function MaterialsList() {
    const { data, refetch } = useGetMaterials();
    return (
        <div>
            <ItemTable data={data || []} idName="materialId" refetch={refetch} useAdminData={useAdminMaterial as any} />
        </div>
    );
}