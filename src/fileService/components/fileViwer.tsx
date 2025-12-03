import { type FileDb } from "../validators/fileValidator"
import { useGetImage } from "../hooks";
import ImageVisualizer from "./imageVisualizer";

interface Props{
    file: FileDb | null;
}
export default function FileViwer({ file }: Props){
    const { data: image } = useGetImage(file?.id);
    if(!file)
        return <div>Select a file to view its details.</div>
    if(!image)
        return <div>Loading image...</div>
    return(
        <div>
            <ImageVisualizer image={image!} />
            <h2>{file?.name}</h2>
            <p>id: {file?.id}</p>
            <p>Uploaded At: {new Date(file?.date).toLocaleString()}</p>
        </div>
    )
}