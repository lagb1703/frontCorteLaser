import { FetchWapper } from "@/utilities/fecth";
import { useCallback, useState, useEffect, useRef } from "react";

export function useGetToken(): { token: string | null, initialized: boolean } {
    const [token, setToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);
    const fetchWrapper = useRef<FetchWapper>(FetchWapper.getInstance());
    const suscriptor = useCallback((newToken: string | null) => {
        setToken(newToken);
    }, []);
    useEffect(() => {
        setToken(fetchWrapper.current.getToken(suscriptor));
        setInitialized(true);
    }, []);
    return { token, initialized };
}