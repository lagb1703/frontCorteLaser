import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AuthService } from "../services/authService";
import { useEffect, useRef } from "react";

export function useLoginGoogle({ enabled }: { enabled: boolean }): UseQueryResult<void, Error> {
    const authServiceRef = useRef<AuthService | null>(null);
    useEffect(() => {
        authServiceRef.current = AuthService.getInstance();
    }, []);
    return useQuery({
        queryKey: ['loginGoogle'],
        queryFn: () => authServiceRef.current!.loginGoogle(),
        enabled: !!authServiceRef.current && enabled,
        retry: false,
    })
}