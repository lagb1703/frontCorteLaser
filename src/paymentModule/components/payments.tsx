import { useGetPayemnts } from "../hoocks";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon } from "lucide-react";
// import { Button } from "@/components/ui/button";

export default function Payments() {
    const { data, isLoading, error } = useGetPayemnts();

    const statusVariant = (status?: string) => {
        if (!status) return "outline" as const;
        const s = String(status).toLowerCase();
        if (s.includes("paid") || s.includes("completed") || s.includes("success")) return "default" as const;
        if (s.includes("pending") || s.includes("processing")) return "secondary" as const;
        return "destructive" as const;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2Icon className="size-5 animate-spin mr-2" />
                <span>Cargando pagos...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-destructive">No se pudieron cargar los pagos.</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Pagos</CardTitle>
            </CardHeader>
            <CardContent>
                {data?.length ? (
                    <div className="flex flex-col divide-y">
                        {data.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between py-3">
                                <div>
                                    <div className="font-medium">{payment.reference}</div>
                                    <div className="text-sm text-muted-foreground">{payment.created_at ? new Date(payment.created_at).toLocaleString() : "--"}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={statusVariant(payment.status)}>{payment.status}</Badge>
                                    {/* <Button size="sm" variant="outline">Ver</Button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">No hay pagos registrados.</div>
                )}
            </CardContent>
        </Card>
    );
}