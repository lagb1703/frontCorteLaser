import { UserService } from "../services/userService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type User } from "../validators/userValidators";
import { useRef } from "react";

export function useGetUser(): UseQueryResult<User | null, Error> {
    const userService = useRef<UserService>(UserService.getInstance());
    return useQuery({
        queryKey: ['getUser'],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: () => {
            try{
                return userService.current.getUser();
            }catch (error){
                return null;
            }
        },
        staleTime: 6000000,
    });
}