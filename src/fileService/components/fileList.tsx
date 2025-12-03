import { type FileDb } from "../validators/fileValidator";
import { Trash2 } from 'lucide-react';


interface Props {
    files: FileDb[];
    setFileId: (id: string | number) => void;
    deleteFile: (id: string | number) => void;
}

export default function FileList({ files, setFileId, deleteFile }: Props) {
    return (
        <ul>
            {files.map((file) => (
                <li
                    key={file.id}
                    className="pointer"
                >
                    <div
                        onClick={() => setFileId(file.id)}>
                        {file.name}
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            console.log("Deleting file with ID: ", file.id);
                            deleteFile(file.id);
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                </li>
            ))}
        </ul>
    );
}