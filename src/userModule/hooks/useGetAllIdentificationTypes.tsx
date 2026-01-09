import { UserService } from "../services/userService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import type { IdentificationType } from "../validators/identificationTypesValidatos";

export function useGetAllIdentificationTypes(): UseQueryResult<Partial<IdentificationType>[], Error> {
    const userService = useRef<UserService>(UserService.getInstance());
    return useQuery({
        queryKey: ['getAllIdentificationTypes'],
        queryFn: () => userService.current.getAllIdentificationTypes(),
        staleTime: 5 * 60 * 1000,
    });
}