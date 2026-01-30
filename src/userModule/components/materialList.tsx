import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { ItemTable } from "./table";
import { useForm } from "react-hook-form";
import { materialSchema } from "@/materialModule/validators/materialValidators";
import { zodResolver } from "@hookform/resolvers/zod";

const spanishNames = {
    name: "Nombre",
    price: "Precio",
    weight: "Peso",
    lastModification: "Última Modificación",
};

export default function MaterialsList() {
    const form = useForm({
        resolver: zodResolver(materialSchema),
        defaultValues: {
            name: "",
            price: 0,
            weight: 0,
        }
    });
    const { data, refetch } = useGetMaterials();
    return (
        <div>
            <ItemTable 
                data={data || []} 
                spanishNames={spanishNames} 
                excemptColumns={["lastModification", "materialId"]} 
                idName="materialId" 
                refetch={refetch} 
                useAdminData={useAdminMaterial as any} 
                form={form} />
        </div>
    );
}