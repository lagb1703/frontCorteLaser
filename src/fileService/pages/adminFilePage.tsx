
import { useChoiseFile } from "../hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFilePage() {
    const { fileId, choiseFile, isLoadingFiles, downloadFile } = useChoiseFile();
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Archivo por ID</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2 mb-4">
                        <Input
                            placeholder="Ingrese el ID del archivo"
                            value={fileId || ""}
                            onChange={(e) => choiseFile(e.target.value)}
                        />
                        <Button onClick={() => downloadFile()} disabled={!fileId || isLoadingFiles}>
                            {isLoadingFiles ? "Descargando..." : "Descargar Archivo"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}