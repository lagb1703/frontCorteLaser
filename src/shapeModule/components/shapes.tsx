import { useGetShape } from "../hooks/useGetShape";
import { Link } from "react-router";

export default function Shapes() {
    const { shapes } = useGetShape();
    return (<main className="flex flex-col">
        {shapes?.map((shape) => {
            return (
                <Link key={shape.id} to={`/shapes/${shape.id}`}>{shape.id}</Link>
            )
        })}
    </main>
    );
}