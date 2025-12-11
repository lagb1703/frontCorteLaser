import { useSaveFile } from "../hooks";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { File } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function UpdateFile() {
    const navigate = useNavigate();
    const saveFile = useSaveFile();
    const updateFile = useCallback(async (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const toastId = toast.loading("Uploading file...");
        try {
            const fileResponse = await saveFile.mutateAsync(formData);
            toast.success("File uploaded successfully", { id: toastId });
            setTimeout(() => {
                navigate(`/quoter/${fileResponse}`);
            }, 600);
        } catch (error: any) {
            toast.error(error.message || "Failed to upload file", { id: toastId });
        }
    }, [saveFile, navigate]);

    return (
        <Card className="flex items-center gap-2">
            <CardContent className="flex flex-col items-center gap-4">
                <div
                    className="flex items-center gap-2">
                    <File className="w-5 h-5 text-gray-600" />
                        <Input
                            type="file"
                            onChange={updateFile}
                            className="cursor-pointer hover:bg-gray-100 transition-colors "
                        />
                </div>
            </CardContent>
        </Card>
    )
}