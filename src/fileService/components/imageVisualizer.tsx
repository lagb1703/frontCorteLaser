
interface props{
    image: Blob;
}

export default function ImageVisualizer({image}: props){
    const imageUrl = URL.createObjectURL(image);
    return(
        <img src={imageUrl} alt="visualizador de imagem" />
    );
}