import { useGetShape } from "../hooks/useGetShape";
import { Link } from "react-router";

export default function Shapes() {
    const { shapes } = useGetShape();
    return (
        <section className="flex w-full flex-row flex-wrap justify-start items-start gap-4">
            {shapes?.map((shape) => {
                return (
                    <article
                        key={shape.shape.id}
                        className="group relative overflow-hidden p-5 min-w-[300px] max-w-[1/4] rounded-xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50/70 hover:shadow-lg"
                    >
                        <Link
                            to={`/shapes/${shape.shape.id}`}
                            className="flex w-full flex-col items-center gap-3 text-slate-700 transition-colors duration-200 hover:text-slate-900"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/70 ring-1 ring-slate-200/70 transition-transform duration-200 group-hover:scale-105">
                                <img
                                    src={shape.imageUrl}
                                    alt={shape.shapeSpanishName}
                                    className="h-14 w-14 object-contain"
                                />
                            </div>
                            <span className="text-sm font-medium tracking-wide">
                                {shape.shapeSpanishName}
                            </span>
                        </Link>
                    </article>
                )
            })}
        </section>
    );
}