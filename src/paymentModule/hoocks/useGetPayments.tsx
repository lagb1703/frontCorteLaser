import { PaymentService } from "../services/paymentService";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import type { DbPaymentType } from "../validators/paymentValidators";

export const useGetPayemnts = (): UseQueryResult<DbPaymentType[]> => {
    const paymentService = useRef<PaymentService>(PaymentService.getInstance());
    return useQuery<DbPaymentType[]>({
        queryKey: ["payments"],
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: false,
        queryFn: () => paymentService.current.getPayments(),
        staleTime: 0,
    });
};