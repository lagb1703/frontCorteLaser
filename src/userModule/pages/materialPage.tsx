import MaterialsList from "../components/materialList";

export default function MaterialPage() {
    return (
        <div
            className="w-full flex flex-wrap justify-center items-center">
            <div>
                <h1
                    className="text-4xl text-center">
                    Gestión de Materiales
                </h1>
            </div>
            <main
                className="basis-full min-w-[300px] p-10 lg:basis-[70%]">
                <MaterialsList />
            </main>
        </div>
    );
}