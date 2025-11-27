import { useSaveFile } from "../hooks";
import { useCallback } from "react";

export default function UpdateFile() {
    const saveFile = useSaveFile();
    const updateFile = useCallback(async (e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file, file.name);
        await saveFile.mutateAsync(formData);
    }, [saveFile]);

    return (
        <input
            type="file"
            onChange={updateFile}
        />
    )
}