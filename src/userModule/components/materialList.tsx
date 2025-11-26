import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { type Material } from "@/materialModule/validators/materialValidators";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface props {
    material: Material | null;
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<{
        name: string;
        price: number;
        materialId?: number | null | undefined;
        lastModification?: Date | null | undefined;
    }[], unknown>>
}

function MaterialItem({ material, refetch }: props) {
    const { register, handleSubmit, formState, status, onDelete } = useAdminMaterial(material, refetch);
    const { errors } = formState as { errors?: Partial<Record<keyof Material, { message?: string }>>; isValid?: boolean };
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
            {material && (
                <button type="button" onClick={onDelete} disabled={status?.isLoading}>
                    Eliminar material
                </button>
            )}
            <button type="submit" disabled={status?.isLoading}>
                {status?.isLoading ? (material ? "Guardando..." : "Creando...") : (material ? "Guardar cambios" : "Crear material")}
            </button>
        </form>
    );
}

export default function MaterialsList() {
    const { data: materials, isLoading, refetch } = useGetMaterials();
    return (
        <div>
            <h2>Materiales</h2>
            {isLoading ? (
                <p>Cargando materiales...</p>
            ) : (
                materials?.map((material) => (
                    <div key={material.materialId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <MaterialItem material={material} refetch={refetch} />
                    </div>
                ))
            )}
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h3>Crear nuevo material</h3>
                <MaterialItem material={null} refetch={refetch} />
            </div>
        </div>
    );
}