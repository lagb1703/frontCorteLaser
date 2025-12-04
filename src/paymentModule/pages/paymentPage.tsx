import Payments from "../components/payments";

export default function PaymentPage() {
    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Pagos</h1>
            <Payments />
        </main>
    );
}