import { useSaveFile } from "../hooks";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner"
import { Input } from "@/components/ui/input";

export default function UpdateFile() {
    const navigate = useNavigate();
    const saveFile = useSaveFile();
    const updateFile = useCallback(async (e: any) => {
        console.log("File to be uploaded:");
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
        <Input
            type="file"
            onChange={updateFile}
        />
    )
}