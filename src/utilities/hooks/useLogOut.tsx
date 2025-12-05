import { FetchWapper } from "@/utilities/fecth";
import { useCallback, useRef } from "react";

export function useLogOut() {
    const fetchWrapper = useRef<FetchWapper>(FetchWapper.getInstance());
    const logOut = useCallback(() => {
        fetchWrapper.current.setToken(null);
    }, [fetchWrapper]);
    return { logOut };
}