import { useAdminThickness } from "../hooks";
import { useGetThickness, useGetMaterials } from "@/materialModule/hooks";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { type Material } from "@/materialModule/validators/materialValidators";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface props {
    thickness: Thickness | null;
    materials: Material[];
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Thickness[], unknown>>
}

function ThicknessItem({ thickness, materials, refetch }: props) {
    const { register, handleSubmit, formState, status, onDelete } = useAdminThickness(thickness, refetch);
    const { errors } = formState as { errors?: Partial<Record<keyof Thickness, { message?: string }>>; isValid?: boolean };
    const material = materials.find((mat) => mat.materialId === thickness?.materialId);
    console.log(errors)
    return (
        <form onSubmit={handleSubmit} noValidate>
            <div>
                <label htmlFor="name">Nombre</label>
                <input id="name" {...register("name")} />
                {errors?.name && <p style={{ color: "#c53030" }}>{errors.name?.message}</p>}
            </div>

            <div>
                <label htmlFor="price">Precio</label>
                <input id="price" type="number" step={1} {...register("price", { valueAsNumber: true })} />
                {errors?.price && <p style={{ color: "#c53030" }}>{errors.price?.message}</p>}
            </div>
            {thickness && (
                <button type="button" onClick={onDelete} disabled={status?.isLoading}>
                    Eliminar grosor
                </button>
            )}
            <button type="submit" disabled={status?.isLoading}>
                {status?.isLoading ? (thickness ? "Guardando..." : "Creando...") : (thickness ? "Guardar cambios" : "Crear grosor")}
            </button>
        </form>
    );
}

export default function ThicknessList() {
    const { data: thicknesses, isLoading, refetch } = useGetThickness();
    const { data: materials, isLoading: isLoadingMaterials } = useGetMaterials();
    console.log(thicknesses);
    return (
        <div>
            <h2>Grosor</h2>
            {(isLoading && isLoadingMaterials) ? (
                <p>Cargando grosores...</p>
            ) : (
                thicknesses?.map((thickness) => (
                    <div key={thickness.thicknessId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <ThicknessItem thickness={thickness} materials={materials ?? []} refetch={refetch} />
                    </div>
                ))
            )}
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h3>Crear nuevo grosor</h3>
                <ThicknessItem thickness={null} materials={materials ?? []} refetch={refetch} />
            </div>
        </div>
    );
}