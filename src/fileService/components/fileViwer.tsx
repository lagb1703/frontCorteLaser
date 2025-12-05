import { type FileDb } from "../validators/fileValidator"
import { useGetImage } from "../hooks";
import ImageVisualizer from "./imageVisualizer";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Props{
    file: FileDb | null;
    downloadFile: () => Promise<void>
}
export default function FileViwer({ file, downloadFile }: Props){
    const { data: image } = useGetImage(file?.id);

    if (!file) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Archivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Selecciona un archivo para ver sus detalles.</div>
                </CardContent>
            </Card>
        );
    }

    if (!image) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Cargando imagen</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{file?.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Link to={`/quoter/${file?.id}`}>
                        <div className="h-full w-full rounded-md">
                            <ImageVisualizer image={image!} />
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="text-sm text-muted-foreground">ID</div>
                        <Badge className="mt-1">{String(file?.id)}</Badge>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground">Subido</div>
                        <div className="mt-1 text-sm">{file?.date ? new Date(file.date).toLocaleString() : "--"}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={`/quoter/${file?.id}`}>
                            <Button size="sm" variant="ghost">Ir a cotizador</Button>
                        </Link>
                        <Button size="sm" onClick={downloadFile}>Descargar</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter />
        </Card>
    )
}