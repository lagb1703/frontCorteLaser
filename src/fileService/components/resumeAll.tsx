import type { PriceInterface } from "../interfaces/prices"
import { Button } from "@/components/ui/button";
import { useOpenClose } from "@/utilities/hooks";
import PaymentDialog from "@/paymentModule/components/paymentDialog";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface ResumeAllProps {
    prices: Array<PriceInterface>;
}
export default function ResumeAll({ prices }: ResumeAllProps) {
    const totalPrice = prices.reduce((acc, curr) => acc + curr.price, 0);
    const disable = prices.reduce((acc, curr) => acc && (curr.amount > 0 && !!curr.materialId && !!curr.thicknessId), prices.length > 0);
    const { isOpen: isPaymentOpen, open: openPayment, close: closePayment } = useOpenClose();
    return (
        <Card className="w-full h-full flex flex-col justify-between shadow-md">
            <CardHeader>
            <CardTitle className="text-xl font-bold">Resumen de la compra</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <Button className="mt-4 w-full" onClick={openPayment} disabled={!disable}>Proceder al pago</Button>
            <PaymentDialog isOpen={isPaymentOpen} onClose={closePayment} items={prices.map(price => {
                return {
                fileId: price.fileId,
                amount: price.amount,
                materialId: price.materialId,
                thicknessId: price.thicknessId
                }
            })} />
            </CardContent>
        </Card>
    );
}