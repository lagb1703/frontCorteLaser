import UpdateFile from "../components/updateFile";

export default function UpdatePage() {
    
    return (
        <div
            className="w-full flex flex-wrap justify-center">
            <div
                className="basis-1/2 min-w-[300px] flex justify-center items-center flex-col">
                <h1
                    className="text-6xl font-bold w-full text-center">Sube tus archivos</h1>
                <div>
                    <p
                        className="text-center text-lg mt-4">
                        Sube tus archivos en formato dxf o zip para comenzar a cotizar tu proyecto de corte láser.
                    </p>
                </div>
            </div>
            <main className="basis-1/2 min-w-[300px] flex justify-center items-center duration-750">
                <UpdateFile />
            </main>
        </div>
    );
}