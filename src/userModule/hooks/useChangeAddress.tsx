import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/userService";

export function useChangeAddress() {
    return useMutation({
        mutationFn: (address: string) => {
            const userService = UserService.getInstance();
            console.log("Changing address to:", address);
            return userService.changeAddress(address);
        },
    });
}