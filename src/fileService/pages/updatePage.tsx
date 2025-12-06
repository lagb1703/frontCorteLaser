import UpdateFile from "../components/updateFile";

export default function UpdatePage() {
    
    return (
        <div
            className="w-full flex">
            <div
                className="basis-1/2 flex justify-center items-center flex-col">
                <h1
                    className="text-6xl font-bold w-full text-center">Sube tu archivo</h1>
                <div>
                    <p
                        className="text-center text-lg mt-4">
                        Sube tu archivo en formato dxf para comenzar a cotizar tu proyecto de corte láser.
                    </p>
                </div>
            </div>
            <main className="basis-1/2 flex justify-center items-center duration-750">
                <UpdateFile />
            </main>
        </div>
    );
}