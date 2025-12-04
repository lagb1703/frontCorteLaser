import { useGetAcceptanceTokens, useGetVerifyInf, usePostPayment, useGetPaymentMethods } from "./"
import { paymentTypeSchema } from "../validators/paymentValidators"
import type { PaymentType } from "../validators/paymentValidators"
import { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

interface InputData {
    fileId: string | number
    materialId: string | number
    thicknessId: string | number
    onClose: () => void
}

export function useManageData({ fileId, materialId, thicknessId, onClose }: InputData) {
    const {
        data: paymentMethods, 
        isLoading: isLoadingPaymentMethods
    } = useGetPaymentMethods();
    const {
        data: acceptancesTokens, 
        isLoading: isLoadingAcceptanceTokens,
        refetch: refetchAcceptanceTokens,
    } = useGetAcceptanceTokens();
    const form = useForm<PaymentType>({
        resolver: zodResolver(paymentTypeSchema),
        mode: "onChange",
        defaultValues: {
            acceptance_token: "",
            accept_personal_auth: "",
            amount_in_cents: undefined,
            paymentMethodId: paymentMethods ? paymentMethods[0].id! : "CARD",
            payment_method: {
                type: paymentMethods ? paymentMethods[0].name : "CARD",
                phone_number: "",
                installments: 1,
            },
            card: {
                number: "",
                cvc: "",
                exp_month: "",
                exp_year: "",
                card_holder: "",
            },
            reference: "",
        },
    })

    const { register, handleSubmit, formState, setValue, clearErrors, control } = form
    useEffect(() => {
        setValue("reference", `${fileId}-${materialId}-${thicknessId}@${crypto.randomUUID()}`)
        clearErrors("reference")
    }, [fileId, materialId, thicknessId]);

    const setAcceptUserPolicy = useCallback((value: boolean) => {
        if(!acceptancesTokens)
            return;
        if(value) {
            setValue("acceptance_token", acceptancesTokens.presigned_acceptance.acceptance_token)
            return;
        }
        setValue("acceptance_token", "");
        clearErrors("acceptance_token")
    }, [acceptancesTokens]);

    const setAcceptancePersonalDataAuth = useCallback((value: boolean) => {
        if(!acceptancesTokens)
            return;
        if(value) {
            setValue("accept_personal_auth", acceptancesTokens.presigned_personal_data_auth.acceptance_token)
            return;
        }
        setValue("accept_personal_auth", "");
        clearErrors("accept_personal_auth")
    }, [acceptancesTokens]);
    
    const paymentMutation = usePostPayment();

    const submitHandler = useCallback(async (data: any) => {
        try {
            if(!data.payment_method?.installments)
                data.payment_method.installments = 1;
            console.log("Submitting payment data:", data);
            await paymentMutation.mutateAsync({
                ...data
            });
            onClose();
        } catch (error) {
            console.error("Payment submission error:", error);
        }finally {
            refetchAcceptanceTokens();
            setValue("acceptance_token", "");
            setValue("accept_personal_auth", "");
        }
    }, [paymentMutation, onClose, refetchAcceptanceTokens]);

    return {
        form,
        register,
        control,
        setValue,
        formState,
        acceptancesTokens,
        isLoadingAcceptanceTokens,
        setAcceptUserPolicy,
        setAcceptancePersonalDataAuth,
        paymentMethods,
        isLoadingPaymentMethods,
        submitHandler: submitHandler,
    }
}