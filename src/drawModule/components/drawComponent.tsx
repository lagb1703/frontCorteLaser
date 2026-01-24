import { useDraw } from "../hooks";
import { Button } from "@/components/ui/button";
import {
    Slash,
    CircleArrowOutUpRight,
    Spline,
    RectangleHorizontal,
    ZoomIn,
    Minus,
    ZoomOut,
    LoaderCircle,
    MousePointer2,
    Move
} from 'lucide-react';

const toolsBar = [
    { name: "select", label: "Seleccionar", icon: MousePointer2 },
    { name: "pan", label: "Mover", icon: Move },
    { name: "line", label: "Linea", icon: Slash },
    { name: "circle", label: "Circulo", icon: CircleArrowOutUpRight },
    { name: "semicircle", label: "Semicirculo", icon: LoaderCircle },
    { name: "spline", label: "Polilinea", icon: Spline },
    { name: "rectangle", label: "Rectangulo", icon: RectangleHorizontal },
]

export default function DrawComponent() {
    const { canvasRef, toolName, setToolName, drawService, save } = useDraw();
    const actionsButtons = [
        { name: "zoomIn", icon: ZoomIn, onclick: ()=>{
            if(drawService.current){
                drawService.current.setZoom(2);
            }
        } },
        { name: "clear", icon: Minus, onclick: ()=>{
            if(drawService.current){
                drawService.current.resetZoom();
            }
        } },
        { name: "zoomOut", icon: ZoomOut, onclick: ()=>{
            if(drawService.current){
                drawService.current.setZoom(0.5);
            }
        } },
    ];
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
                            border-x-0 first:rounded-l-sm last:rounded-r-sm rounded-none 
                            shadow-none 
                            ml-0 w-24 h-24` +
                            (toolName === tool.name
                                ? " bg-blue-500 text-white border-blue-500 hover:bg-blue-500 hover:text-white"
                                : " bg-white text-black border-gray-300"
                            )
                        }
                        onClick={() => setToolName(tool.name)}>
                        <tool.icon />
                        {tool.label}
                    </Button>))}
            </section>
            <section
                className="flex w-full justify-center items-center bg-white relative">
                <div
                    className="w-full h-[300px] justify-center items-center">
                    <canvas 
                        ref={canvasRef} 
                        className="border w-[500px] h-full border-black mx-auto"></canvas>
                </div>
                <article
                    className="absolute right-0 top-1/2 flex flex-col -translate-y-1/2">
                    {actionsButtons.map((action) => (
                        <Button
                            key={action.name}
                            variant="outline"
                            className="rounded-full m-1 p-2"
                            onClick={action.onclick}>
                            <action.icon />
                        </Button>
                    ))}
                </article>
            </section>
            <div>
                <Button onClick={save}>Save Drawing</Button>
            </div>
        </main>
    );
}