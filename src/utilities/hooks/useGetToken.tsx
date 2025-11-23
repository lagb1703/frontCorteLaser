import { FetchWapper } from "@/utilities/fecth";
import { useCallback, useState, useEffect } from "react";

export function useGetToken(): string | null {
    const [token, setToken] = useState<string | null>(null);
    const fetchWrapper = FetchWapper.getInstance();
    const suscriptor = useCallback((newToken: string | null) => {
        setToken(newToken);
    }, []);
    useEffect(() => {
        fetchWrapper.getToken(suscriptor);
    }, []);
    return token;
}