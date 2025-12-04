import { useGetPayemnts } from "../hoocks";
export default function Payments() {
    const { data, isLoading, error } = useGetPayemnts();

    if (isLoading) {
        return <div>Loading payments...</div>;
    }

    if (error) {
        return <div>Error loading payments</div>;
    }
    return (
        <div>
            <ul>
                {data?.map(payment => (
                    <li key={payment.id}>{payment.reference} - {payment.status}</li>
                ))}
            </ul>
        </div>
    );
}