import { useInfo } from "../hooks";
import { type User } from "../validators/userValidators";

interface props {
    disable?: boolean;
}

export default function UserReview({ disable = false }: props) {
    const { register, handleSummit, formState, changeStatus } = useInfo();
    const { errors } = formState as { errors?: Partial<Record<keyof User, { message?: string }>> };

    return (
        <form onSubmit={handleSummit} noValidate>
            <h2>Editar Usuario</h2>
            <div>
                <label htmlFor="names">Nombres</label>
                <input
                    id="names"
                    {...register("names")}
                    disabled={disable || true}
                    aria-invalid={errors?.names ? "true" : "false"}
                />
                {errors?.names && <span role="alert">{String(errors.names?.message)}</span>}
            </div>
            <div>
                <label htmlFor="lastNames">Apellidos</label>
                <input
                    id="lastNames"
                    {...register("lastNames")}
                    disabled={disable || true}
                    aria-invalid={errors?.lastNames ? "true" : "false"}
                />
                {errors?.lastNames && <span role="alert">{String(errors.lastNames?.message)}</span>}
            </div>
            <div>
                <label htmlFor="email">Correo</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={disable || true}
                    aria-invalid={errors?.email ? "true" : "false"}
                />
                {errors?.email && <span role="alert">{String(errors.email?.message)}</span>}
            </div>
            <div>
                <label htmlFor="address">Dirección</label>
                <input
                    id="address"
                    {...register("address")}
                    disabled={disable}
                    aria-invalid={errors?.address ? "true" : "false"}
                />
                {errors?.address && <span role="alert">{String(errors.address?.message)}</span>}
            </div>
            <div>
                <label htmlFor="phone">Teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    disabled={disable || true}
                    aria-invalid={errors?.phone ? "true" : "false"}
                />
                {errors?.phone && <span role="alert">{String(errors.phone?.message)}</span>}
            </div>
            {!disable && (
                <div>
                    <button type="submit" disabled={changeStatus === "pending"}>
                        {changeStatus === "pending" ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            )}
        </form>
    );
}