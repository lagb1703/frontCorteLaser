import { useChoiseFile } from "../hooks/useChoiseFile";
import FileViwer from "../components/fileViwer";
import FileList from "../components/fileList";


export default function FilesPage() {
    const { fileId, files, choiseFile, isLoadingFiles, file, handleDeleteFile, downloadFile } = useChoiseFile();

    return (
        <div
            className="flex flex-wrap justify-around items-center h-full pt-4 pb-4 gap-1">
            <div
                className="basis-[31%] min-w-[300px] max-h-[80vh] overflow-y-auto">
                <FileList fileId={fileId} files={files || []} isLoading={isLoadingFiles} setFileId={choiseFile} deleteFile={handleDeleteFile} />
            </div>
            <div
                className="basis-2/3">
                <FileViwer file={file} downloadFile={downloadFile} />
            </div>
        </div>
    );
}