import { FetchWapper } from "@/utilities/fecth";
import { useCallback, useRef } from "react";
import { useQueryClient } from '@tanstack/react-query'

export function useLogOut() {
    const queryClient = useQueryClient();
    const fetchWrapper = useRef<FetchWapper>(FetchWapper.getInstance());
    const logOut = useCallback(() => {
        fetchWrapper.current.setToken(null);
        try {
            queryClient.getQueryCache().clear();
            queryClient.getMutationCache().clear();
        } catch (e) {
            // In case those methods are unavailable, ensure queries are removed
        }
        queryClient.removeQueries();
    }, [fetchWrapper, queryClient]);
    return { logOut };
}