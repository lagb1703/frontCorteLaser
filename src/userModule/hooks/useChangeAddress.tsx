import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/userService";

export function useChangeAddress() {
    return useMutation({
        mutationFn: (address: string) => {
            const userService = UserService.getInstance();
            return userService.changeAddress(address);
        },
    });
}