import { UserService } from "../services/userService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type UserToken } from "../interfaces/userToken";
import { useRef } from "react";

export function useGetUser(): UseQueryResult<UserToken, Error> {
    const userService = useRef<UserService>(UserService.getInstance());
    return useQuery({
        queryKey: ['getUser'],
        queryFn: () => userService.current.getUser(),
        staleTime: 5 * 60 * 1000,
    });
}