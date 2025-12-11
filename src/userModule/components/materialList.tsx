import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { ItemTable } from "./table";
import { type Material } from "@/materialModule/validators/materialValidators";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";


interface props {
    material: Material | null;
    refetch: (options?: RefetchOptions | undefined) => Promise<
        QueryObserverResult<
            {
                name: string;
                price: number;
                materialId?: number | null | undefined;
                lastModification?: Date | null | undefined;
            }[],
            unknown
        >
    >;
}

export default function MaterialsList() {
    const { data, refetch } = useGetMaterials();
    return (
        <div>
            <ItemTable data={data || []} idName="materialId" refetch={refetch} useAdminData={useAdminMaterial} />
        </div>
    );
}