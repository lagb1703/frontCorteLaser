import { PaymentService } from "../services/paymentService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import type { AcceptanceTokens } from "../validators/tokenValidators";

export const useGetAcceptanceTokens = (): UseQueryResult<AcceptanceTokens> => {
    const paymentService = useRef<PaymentService>(PaymentService.getInstance());
    return useQuery<AcceptanceTokens>({
        queryKey: ["acceptanceTokens"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: () => paymentService.current.getAcceptanceTokens(),
        staleTime: 0,
    });
};