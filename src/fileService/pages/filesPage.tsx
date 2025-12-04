import { useChoiseFile } from "../hooks/useChoiseFile";
import FileViwer from "../components/fileViwer";
import FileList from "../components/fileList";


export default function FilesPage() {
    const { files, choiseFile, isLoadingFiles, file, handleDeleteFile, downloadFile } = useChoiseFile();

    return (
        <div>
            <FileList files={files || []} isLoading={isLoadingFiles} setFileId={choiseFile} deleteFile={handleDeleteFile} />
            <FileViwer file={file} downloadFile={downloadFile} />
        </div>
    );
}