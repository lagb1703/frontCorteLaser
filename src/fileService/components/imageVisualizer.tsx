
interface props {
    image: Blob;
}

export default function ImageVisualizer({ image }: props) {
    const imageUrl = URL.createObjectURL(image);
    return (
        <div
                    className="h-full w-full bg-muted flex items-center justify-center overflow-hidden rounded-md">
                    <img
                        src={imageUrl}
                        alt="visualizador de imagen"
                        className="max-h-[420px] max-w-full object-contain block"
                    />
                </div>
    );
}