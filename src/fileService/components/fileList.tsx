import { type FileDb } from "../validators/fileValidator";
import { Trash2 } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    files: FileDb[];
    isLoading: boolean;
    fileId: string | number | null;
    setFileId: (id: string | number) => void;
    deleteFile: (id: string | number) => void;
}

export default function FileList({ files, isLoading, fileId, setFileId, deleteFile }: Props) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Archivos</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <ul className="flex flex-col divide-y">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="ml-4 w-28 flex items-center justify-end gap-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-12" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : files.length ? (
                    <ul className="flex flex-col divide-y">
                        {files.map((file) => (
                            <li key={file.id} className={`flex items-center justify-between rounded-lg p-2 ${file.id === fileId ? 'bg-accent' : ''}`}>
                                <Button
                                    variant="ghost"
                                    onClick={() => setFileId(file.id)}
                                    className="h-auto min-h-8 flex-1 justify-start whitespace-normal p-0 text-left text-sm font-normal hover:underline"
                                    aria-label={`Ver ${file.name}`}
                                >
                                    {file.name}
                                </Button>

                                <div className="ml-4 flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setFileId(file.id)}>
                                        Ver
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteFile(file.id);
                                        }}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-sm text-muted-foreground">No hay archivos.</div>
                )}
            </CardContent>
        </Card>
    );
}