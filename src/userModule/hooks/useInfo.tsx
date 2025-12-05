import { useGetUser } from "./useGetUser";
import { useChangeAddress } from "./useChangeAddress";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type User } from "../validators/userValidators"
import { toast } from "sonner";

export function useInfo() {
    const { data } = useGetUser();
    const form = useForm<User>({
        resolver: zodResolver(userSchema) as Resolver<User>,
        mode: "onChange",
        defaultValues: {
            names: "",
            lastNames: "",
            email: "",
            address: "",
            phone: "",
            password: "jajajacontraimprovisada",
        },
    })

    const { setValue } = form

    useEffect(() => {
        if (data) {
            setValue("names", data.names);
            setValue("lastNames", data.lastNames);
            setValue("email", data.email);
            setValue("address", data.address);
            setValue("phone", data.phone);
        }
    }, [data, setValue]);
    const changeAddressMutation = useChangeAddress()
    const onSubmit = useCallback(
        (data: User) => {
            const toastId = toast.loading("Actualizando datos...");
            try {
                changeAddressMutation.mutate(data.address)
                toast.success("Datos actualizados con éxito", { id: toastId });
            } catch (error) {
                toast.error("Error al actualizar los datos");
            }
        },
        [changeAddressMutation])
    return {
        form,
        handleSummit: onSubmit,
        changeStatus: changeAddressMutation.status,
    }
}