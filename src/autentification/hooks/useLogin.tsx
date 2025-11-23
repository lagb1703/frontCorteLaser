import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { AuthService } from "../services/authService";
import { type LoginInput } from "../validators/userValidators";

export function useLogin(): UseMutationResult<boolean, Error, LoginInput> {
    return useMutation({
        mutationFn: ({ email, password }: LoginInput) => {
            const authService = AuthService.getInstance();
            console.log("useLogin mutationFn called with:", { email, password });
            return authService.login(email, password);
        },
    });
}