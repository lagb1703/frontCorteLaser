import Shapes from "../components/shapes";

export default function ShapesPage() {
    return (
        <main>
            <h1 className="mx-10 py-20 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                figuras
                <span className="ml-2 text-slate-400">programables</span>
            </h1>
            <div
                className="flex flex-col items-center justify-center">
                <div
                    className="w-full max-w-7xl px-4 py-8">
                    <Shapes />
                </div>
            </div>
        </main>
    );
}