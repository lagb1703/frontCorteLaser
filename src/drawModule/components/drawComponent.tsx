import { useDraw } from "../hooks";
import { Button } from "@/components/ui/button";
import { Slash, CircleArrowOutUpRight, Spline, RectangleHorizontal } from 'lucide-react';

const toolsBar = [
    { name: "line", label: "Linea", icon: Slash },
    { name: "circle", label: "Circulo", icon: CircleArrowOutUpRight },
    { name: "spline", label: "Polilinea", icon: Spline },
    { name: "rectangle", label: "Rectangulo", icon: RectangleHorizontal },
]

export default function DrawComponent() {
    const { canvasRef, setToolName, save } = useDraw();
    return (
        <main>
            <section
                className="flex w-full justify-start h-24 px-4 items-center bg-[#fafafa]">
                {toolsBar.map((tool) => (
                    <Button
                        key={tool.name}
                        variant="outline"
                        className={
                            `flex flex-col justify-around items-center 
                            border-x-0 first:rounded-l-sm last:rounded-r-sm rounded-none shadow-none
                            ml-0 w-24 h-24`
                        }
                        onClick={() => setToolName(tool.name)}>
                        <tool.icon />
                        {tool.label}
                    </Button>))}
            </section>
            <section
                className="flex w-full justify-center items-center bg-white">
                <canvas ref={canvasRef} className="w-[90%] border border-black"></canvas>
                <article>
                    <Button variant="outline" className="mb-2">Clear Canvas</Button>
                </article>
            </section>
            <div>
                <Button onClick={save}>Save Drawing</Button>
            </div>
        </main>
    );
}