import { useGetAcceptanceTokens, usePostPayment, useGetPaymentMethods } from "./"
import { paymentTypeSchema } from "../validators/paymentValidators"
import type { PaymentType } from "../validators/paymentValidators"
import { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

interface InputData {
    fileId: string | number
    materialId: string | number
    thicknessId: string | number
    amount: number
    onClose: () => void
}

export function useManageData({ fileId, materialId, thicknessId, amount, onClose }: InputData) {
    const navigate = useNavigate();
    const {
        data: paymentMethods, 
        isLoading: isLoadingPaymentMethods
    } = useGetPaymentMethods();
    console.log("Payment Methods:", paymentMethods);
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
            paymentMethodId: paymentMethods ? paymentMethods[0].id! : 1,
            payment_method: {
                type: paymentMethods ? paymentMethods[0].name : "NEQUI",
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

    const { setValue, clearErrors, control } = form

    const setAcceptUserPolicy = useCallback((value: boolean) => {
        if(!acceptancesTokens)
            return;
        if(value) {
            setValue("acceptance_token", acceptancesTokens.presigned_acceptance.acceptance_token, { shouldValidate: true, shouldDirty: true })
            return;
        }
        setValue("acceptance_token", "", { shouldValidate: true, shouldDirty: true });
        clearErrors("acceptance_token")
    }, [acceptancesTokens]);

    const setAcceptancePersonalDataAuth = useCallback((value: boolean) => {
        if(!acceptancesTokens)
            return;
        if(value) {
            setValue("accept_personal_auth", acceptancesTokens.presigned_personal_data_auth.acceptance_token, { shouldValidate: true, shouldDirty: true })
            return;
        }
        setValue("accept_personal_auth", "", { shouldValidate: true, shouldDirty: true });
        clearErrors("accept_personal_auth")
    }, [acceptancesTokens]);
    
    const paymentMutation = usePostPayment();

    const submitHandler = useCallback(async (data: any) => {
        try {
            if(!data.payment_method?.installments)
                data.payment_method.installments = 1;
            data.reference = `${fileId}-${materialId}-${thicknessId}-${amount}@${crypto.randomUUID()}`;
            const toastId = toast.loading("Procesando el pago...");
            try{
                await paymentMutation.mutateAsync({
                    ...data
                });
                toast.success("Pago realizado con éxito", { id: toastId });
                onClose();
                navigate("/payments");
            }catch(e){
                console.error("Payment error:", e);
                toast.error("Error al procesar el pago", { id: toastId });
            }
        } catch (error) {
            console.error("Payment submission error:", error);
        }finally {
            refetchAcceptanceTokens();
            setValue("acceptance_token", "", { shouldValidate: true, shouldDirty: true });
            setValue("accept_personal_auth", "", { shouldValidate: true, shouldDirty: true });
        }
    }, [paymentMutation, onClose, refetchAcceptanceTokens, fileId, materialId, thicknessId, amount]);

    useEffect(() => {
        if (!paymentMethods || paymentMethods.length === 0) return;
        const first = paymentMethods[0];
        setValue("paymentMethodId", first.id ?? 1, { shouldValidate: true, shouldDirty: true });
        setValue("payment_method.type", first.name ?? "NEQUI", { shouldValidate: true, shouldDirty: true });
    }, [paymentMethods, setValue]);

    return {
        form,
        control,
        setValue,
        acceptancesTokens,
        isLoadingAcceptanceTokens,
        setAcceptUserPolicy,
        setAcceptancePersonalDataAuth,
        paymentMethods,
        isLoadingPaymentMethods,
        submitHandler: submitHandler,
    }
}