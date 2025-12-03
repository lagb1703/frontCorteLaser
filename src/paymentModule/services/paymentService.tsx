import { FetchWapper } from "@/utilities/fecth";
import type { PaymentMethodType, PaymentType, DbPaymentType } from "../validators/paymentValidators";
import type { AcceptanceTokens } from "../validators/tokenValidators";
class PaymentService {
    private fetchWrapper: FetchWapper;
    private static instance: PaymentService;

    public static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    private constructor() {
        this.fetchWrapper = FetchWapper.getInstance();
    }

    public async getPaymentMethods(): Promise<PaymentMethodType[]> {
        const result = await this.fetchWrapper.send("/payment/paymentsMethods");
        if(!result.ok) throw new Error("Error fetching payment methods");
        const data = await result.json();
        return data as PaymentMethodType[];
    }
    public async getAcceptanceTokens(): Promise<AcceptanceTokens> {
        const result = await this.fetchWrapper.send("/payment/acceptancesTokens");
        if(!result.ok) throw new Error("Error fetching acceptance tokens");
        const data = await result.json();
        return data as AcceptanceTokens;
    }
    public async makePayment(payment: PaymentType): Promise<string> {
        const result = await this.fetchWrapper.send("/payment", {
            method: "POST",
            body: JSON.stringify(payment),
            headers: {"Content-Type": "application/json"},
        });
        if(!result.ok) throw new Error("Error making payment");
        const data = await result.text();
        return data;
    }
    public async verifyPayment(id: string): Promise<string> {
        const result = await this.fetchWrapper.send(`/payment/verify?id=${id}`);
        if(!result.ok) throw new Error("Error verifying payment");
        const data = await result.text();
        return data;
    }
    public async untilNotGetPending(id: string): Promise<string> {
        const result = await this.fetchWrapper.send(`/payment/verify/APROVED?id=${id}`);
        if(!result.ok) throw new Error("Error verifying payment");
        const data = await result.text();
        return data;
    }
    public async getPayments(): Promise<DbPaymentType[]> {
        const result = await this.fetchWrapper.send(`/payment`);
        if(!result.ok) throw new Error("Error fetching payments");
        const data = await result.json();
        return data as DbPaymentType[];
    }
}