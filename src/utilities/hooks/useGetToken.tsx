import { FetchWapper } from "@/utilities/fecth";
import { useCallback, useState, useEffect, useRef } from "react";

export function useGetToken(): string | null {
    const [token, setToken] = useState<string | null>(null);
    const fetchWrapper = useRef<FetchWapper>(FetchWapper.getInstance());
    const suscriptor = useCallback((newToken: string | null) => {
        setToken(newToken);
    }, []);
    useEffect(() => {
        setToken(fetchWrapper.current.getToken(suscriptor));
    }, []);
    return token;
}