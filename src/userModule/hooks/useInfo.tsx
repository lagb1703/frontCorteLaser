import { useGetUser } from "./useGetUser";
import { useChangeAddress } from "./useChangeAddress";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type User } from "../validators/userValidators"
import { z } from "zod"

export function useInfo() {
    const { data, isLoading } = useGetUser();
    const {
        register,
        handleSubmit,
        formState,
        setValue
    } = useForm<User>({
        // usar un resolver que valide solamente la dirección en este hook
        // para evitar que campos obligatorios no presentes bloqueen el submit
        resolver: zodResolver(z.object({ address: userSchema.shape.address })) as Resolver<User>,
        mode: "onChange"
    })
    useEffect(() => {
        if (data){
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
            console.log("Submitting address change to:", data);
            changeAddressMutation.mutate(data.address)
        },
        [changeAddressMutation])
    return {
        register,
        handleSummit: handleSubmit(onSubmit),
        formState,
        onSubmit,
        changeStatus: changeAddressMutation.status,
        isLoading
    }
}