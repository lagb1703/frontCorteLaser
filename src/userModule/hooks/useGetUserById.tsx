import { UserService } from "../services/userService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type User } from "./../validators/userValidators";
import {useRef} from "react";

export function useGetUserById(userId: string | number): UseQueryResult<User, Error> {
    const userService = useRef<UserService>(UserService.getInstance());
    return useQuery({
        queryKey: ['getUserById', userId],
        queryFn: () => userService.current.getUserById(userId),
        enabled: false,
    });
}