import { PaymentService } from "../services/paymentService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";
import type { PaymentType } from "../validators/paymentValidators";

export const usePostPayment = (): UseMutationResult<string, Error, PaymentType> => {
    const paymentService = useRef<PaymentService>(PaymentService.getInstance());
    return useMutation<string, Error, PaymentType>({
        mutationKey: ["postPayment"],
        mutationFn: (payment: PaymentType) => paymentService.current.makePayment(payment),
    });
}