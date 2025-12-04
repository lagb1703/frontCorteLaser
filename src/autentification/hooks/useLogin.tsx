import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { AuthService } from "../services/authService";
import { type LoginInput } from "../validators/userValidators";
import { useRef } from "react";

export function useLogin(): UseMutationResult<boolean, Error, LoginInput> {
    const authService = useRef(AuthService.getInstance());
    return useMutation({
        mutationFn: ({ email, password }: LoginInput) => {
            return authService.current.login(email, password);
        },
    });
}