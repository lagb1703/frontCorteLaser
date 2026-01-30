import { useAdminThickness } from "../hooks";
import { useGetThickness } from "@/materialModule/hooks";
import { ItemTable } from "./table";
import { useForm } from "react-hook-form";
import { thicknessSchema } from "@/materialModule/validators/thicknessValidators";
import { zodResolver } from "@hookform/resolvers/zod";

const spanishNames = {
    name: "Nombre",
    price: "Precio",
    lastModification: "Última Modificación",
};

export default function ThicknessList() {
    const { data: thicknesses, refetch } = useGetThickness();
    const form = useForm({
        resolver: zodResolver(thicknessSchema),
        defaultValues: {
            name: "",
            price: 0,
        }
    });
    return (
        <div>
            <ItemTable 
                data={thicknesses?.map((thickness) => ({
                    thicknessId: thickness.thicknessId,
                    name: thickness.name,
                    price: thickness.price,
                    lastModification: thickness.lastModification,
                })) || []} 
                idName="thicknessId" 
                refetch={refetch} 
                spanishNames={spanishNames} 
                excemptColumns={["lastModification", "thicknessId"]} 
                form={form}
                useAdminData={useAdminThickness} />
        </div>
    );
}