import { type FileDb } from "../validators/fileValidator";
import { useGetAllUserFile, useDeleteFile, useGetFile } from "./";
import { useState, useCallback } from "react";


export function useChoiseFile(){
    const [fileId, setFileId] = useState<string | number | null>(null);
    const { data: files, refetch: refetchUserFiles } = useGetAllUserFile();
    const choiseFile = useCallback((id: string | number) => {
        setFileId(id);
    }, []);
    const file = files?.find(f => f.id === fileId) || null;
    const deleteMutation = useDeleteFile();
    const handleDeleteFile = useCallback(async (fileId: string | number | null) => {
        if(fileId === null) return;
        console.log("Deleting file with ID:", fileId, file);
        if(file?.id == fileId){
            setFileId(null);
        }
        await deleteMutation.mutateAsync(fileId);
        await refetchUserFiles();
    }, [deleteMutation, refetchUserFiles, file]);
    const { refetch } = useGetFile(fileId!);
    const downloadFile = useCallback(async () => {
        if(fileId === null) return;
        const result = await refetch();
        if(!result.data) return;
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = files?.find(f => f.id === fileId)?.name || 'downloadedFile';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }, [fileId, refetch, files]);
    console.log("Selected file:", file);
    return {
        files,
        choiseFile,
        file,
        handleDeleteFile,
        downloadFile,
    };
}