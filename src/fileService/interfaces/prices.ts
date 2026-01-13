import type { ReferenceType } from "@/paymentModule/validators/paymentValidators";

export interface PriceInterface extends ReferenceType {
    price: number;
}