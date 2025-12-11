import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AuthService } from "../services/authService";
import { useEffect, useRef } from "react";

export function useLoginGoogle({ enabled }: { enabled: boolean }): UseQueryResult<void, Error> {
    return {
        refetch: () => {
            
        }
    } as UseQueryResult<void, Error>;
}