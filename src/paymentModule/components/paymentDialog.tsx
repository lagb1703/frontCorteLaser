import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useWatch } from "react-hook-form"
import {
    Form,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useManageData } from "../hoocks"
import PaymentChoice from "./paymentChoise"
import { Label } from "@/components/ui/label"

type PaymentDialogProps = {
    isOpen: boolean
    onClose: () => void
    fileId: string | number
    materialId: string | number
    thicknessId: string | number
}

export default function PaymentDialog({ isOpen, onClose, fileId, materialId, thicknessId }: PaymentDialogProps) {
    const {
        form,
        register,
        formState,
        control,
        setValue,
        acceptancesTokens,
        isLoadingAcceptanceTokens,
        setAcceptUserPolicy,
        setAcceptancePersonalDataAuth,
        paymentMethods,
        isLoadingPaymentMethods,
        submitHandler,
    } = useManageData({ fileId, materialId, thicknessId, onClose });
    const acceptance_token = useWatch({ control, name: "acceptance_token" }) as string
    const accept_personal_auth = useWatch({ control, name: "accept_personal_auth" }) as string
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Payment Information</DialogTitle>
                    <DialogDescription>
                        Please enter your payment details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <PaymentChoice
                        register={register}
                        formState={formState}
                        control={control}
                        setValue={setValue}
                        paymentMethods={paymentMethods}
                        isLoadingPaymentMethods={isLoadingPaymentMethods}
                    />
                    <div
                        className="flex justify-between items-center mb-4"
                    >
                        <div
                            className="basis-1/2 flex justify-start items-center gap-2">
                            <Checkbox
                                id="accept-user-policy"
                                checked={!!acceptance_token}
                                onCheckedChange={(checked) => setAcceptUserPolicy(!!checked)}
                                disabled={isLoadingAcceptanceTokens}
                            />
                            <Label htmlFor="accept-user-policy" className="text-sm">
                                <a href={acceptancesTokens?.presigned_acceptance.permalink} target="_blank" rel="noopener noreferrer">
                                    I accept the user policy
                                </a>
                            </Label>
                        </div>
                        <div
                            className="basis-1/2 flex justify-end items-center gap-2">
                            <Checkbox
                                id="accept-personal-auth"
                                checked={!!accept_personal_auth}
                                onCheckedChange={(checked) => setAcceptancePersonalDataAuth(!!checked)}
                                disabled={isLoadingAcceptanceTokens}
                            />
                            <Label htmlFor="accept-personal-auth" className="text-sm">
                                <a href={acceptancesTokens?.presigned_personal_data_auth.permalink} target="_blank" rel="noopener noreferrer">
                                    I accept the personal data authorization
                                </a>
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={form.handleSubmit(submitHandler)}
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                        >
                            Submit
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}