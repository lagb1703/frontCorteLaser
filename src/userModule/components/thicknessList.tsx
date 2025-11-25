import { useAdminMaterial } from "../hooks";
import { useGetMaterials } from "@/materialModule/hooks";
import { type Material } from "@/materialModule/validators/materialValidators";

interface props {
    material: Material | null;
}

function MaterialItem({ material }: props) {
    const { register, handleSubmit, formState, status } = useAdminMaterial(material);
    const { errors, isValid } = formState as { errors?: Partial<Record<keyof Material, { message?: string }>>; isValid?: boolean };

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

            <button type="submit" disabled={status?.isLoading || !isValid}>
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
                        <MaterialItem material={material} />
                    </div>
                ))
            )}
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h3>Crear nuevo material</h3>
                <MaterialItem material={null} />
            </div>
        </div>
    );
}