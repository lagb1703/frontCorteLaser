import { useSaveFile } from "../hooks";
import { useNavigate } from "react-router";
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { File } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useCallback } from "react";
import { MultifileContext } from "@/utilities/global/multifileContext";

export default function UpdateFile() {
    const { setFilesIds } = useContext(MultifileContext);
    const navigate = useNavigate();
    const saveFile = useSaveFile();
    const updateFile = useCallback(async (e: any) => {
        const files = e.target?.files;
        const filesIds: string[] = [];
        if (!files || files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const toastId = toast.loading(`Uploading file ${file.name}...`);
            const formData = new FormData();
            formData.append('file', file, file.name);
            try {
                const fileResponse = await saveFile.mutateAsync(formData);
                toast.success("File uploaded successfully", { id: toastId });
                filesIds.push(String(fileResponse));
            } catch (error: any) {
                toast.error(error.message || "Failed to upload file", { id: toastId });
            }
        }
        if (filesIds.length === 1) {
            setFilesIds([]);
            setTimeout(() => {
                toast.success("Archivo procesado");
            }, 300);
            setTimeout(() => {
                navigate(`/quoter/${filesIds[0]}`);
            }, 1000);
            return;
        }
        setFilesIds(filesIds);
        setTimeout(() => {
            toast.success("Archivos procesados");
        }, 300);
        setTimeout(() => {
            navigate(`/quoter`);
        }, 1000);
    }, [saveFile, navigate, setFilesIds]);
    return (
        <Card className="flex items-center gap-2">
            <CardContent className="flex flex-col items-center gap-4">
                <div
                    className="flex items-center gap-2">
                    <File className="w-5 h-5 text-gray-600" />
                    <Input
                        type="file"
                        multiple
                        onChange={updateFile}
                        className="cursor-pointer hover:bg-gray-100 transition-colors "
                    />
                </div>
            </CardContent>
        </Card>
    )
}