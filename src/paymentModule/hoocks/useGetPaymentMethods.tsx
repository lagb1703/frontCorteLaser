import { PaymentService } from "../services/paymentService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import type { PaymentMethodType } from "../validators/paymentValidators";

export const useGetPaymentMethods = (): UseQueryResult<PaymentMethodType[], Error> => {
    const paymentService = useRef<PaymentService>(PaymentService.getInstance());
    return useQuery<PaymentMethodType[], Error>({
        queryKey: ["paymentMethods"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: () => paymentService.current.getPaymentMethods(),
        staleTime: 10000,
    });
}