import ThicknessList from "../components/thicknessList";

export default function ThicknessPage() {
    return (
        <div
            className="w-full flex flex-wrap justify-center items-center">
            <div>
                <h1
                    className="text-4xl text-center">
                    Gestión de Grosores
                </h1>
            </div>
            <main
                className="basis-full min-w-[300px] p-10 lg:basis-[70%]">
            <ThicknessList />
            </main>
        </div>
    );
}