import { useSaveFile } from "../hooks";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function UpdateFile() {
    const navigate = useNavigate();
    const saveFile = useSaveFile();
    const updateFile = useCallback(async (e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const fileResponse = await saveFile.mutateAsync(formData);
        console.log(fileResponse);
        navigate(`/quoter/${fileResponse}`);
    }, [saveFile, navigate]);

    return (
        <input
            type="file"
            onChange={updateFile}
        />
    )
}