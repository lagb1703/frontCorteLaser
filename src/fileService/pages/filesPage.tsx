import { useChoiseFile } from "../hooks/useChoiseFile";
import FileViwer from "../components/fileViwer";
import FileList from "../components/fileList";


export default function FilesPage() {
    const { files, choiseFile, file, handleDeleteFile, downloadFile } = useChoiseFile();

    return (
        <div>
            <FileList files={files || []} setFileId={choiseFile} deleteFile={handleDeleteFile} />
            <FileViwer file={file} />
            <button onClick={downloadFile}>Download File</button>
        </div>
    );
}