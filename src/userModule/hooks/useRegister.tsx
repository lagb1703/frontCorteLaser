import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/userService";
import { type User } from "../validators/userValidators";

export function useRegister() {
    return useMutation({
        mutationFn: (user: User) => {
            const userService = UserService.getInstance();
            return userService.register(user);
        },
    });
}