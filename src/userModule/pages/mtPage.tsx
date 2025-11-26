import ThicknessMaterialList from "../components/ThicknessMaterialList";

export default function MtPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Materiales y Grosor</h1>
            <ThicknessMaterialList />
        </div>
    );
}