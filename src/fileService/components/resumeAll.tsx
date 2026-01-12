import type { PriceInterface } from "../interfaces/prices"
import { Button } from "@/components/ui/button";

interface ResumeAllProps {
    prices: Array<PriceInterface>;
}
export default function ResumeAll({ prices }: ResumeAllProps) {
    const totalPrice = prices.reduce((acc, curr) => acc + curr.price, 0);
    return (
        <div className="w-full h-full flex flex-col justify-between p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Resumen de la compra</h2>
            <div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <Button className="mt-4 w-full">Proceder al pago</Button>
            </div>
        </div>
    );
}