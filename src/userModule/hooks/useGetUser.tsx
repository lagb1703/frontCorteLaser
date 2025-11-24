import { UserService } from "../services/userService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type User } from "../validators/userValidators";
import { useRef } from "react";

export function useGetUser(): UseQueryResult<User, Error> {
    const userService = useRef<UserService>(UserService.getInstance());
    return useQuery({
        queryKey: ['getUser'],
        queryFn: () => userService.current.getUser(),
        staleTime: 5 * 60 * 1000,
    });
}