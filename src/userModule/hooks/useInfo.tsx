import { useGetUser } from "./useGetUser";
import { useChangeAddress } from "./useChangeAddress";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type User } from "../validators/userValidators"

export function useInfo() {
    const { data, isLoading } = useGetUser();
    const {
        register,
        handleSubmit,
        formState,
        setValue
    } = useForm<User>({
        resolver: zodResolver(userSchema) as Resolver<User>,
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