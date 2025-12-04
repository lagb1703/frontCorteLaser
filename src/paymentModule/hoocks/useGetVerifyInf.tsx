import { PaymentService } from "../services/paymentService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export const useGetVerifyInf = (paymentId: string | number | undefined | null): UseQueryResult<string> => {
    const paymentService = useRef<PaymentService>(PaymentService.getInstance());
    return useQuery<string>({
        queryKey: ["verifyInf", paymentId],
        queryFn: () => {
            if (!paymentId) throw new Error("Payment ID is required");
            return paymentService.current.untilNotGetPending(paymentId); 
        },
        enabled: false,
        staleTime: 0,
    });
}