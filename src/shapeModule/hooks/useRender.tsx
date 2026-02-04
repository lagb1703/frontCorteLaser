import { useEffect, useRef } from "react";
import type { Shape } from "../interfaces";
import paper from "paper";

export function useRender(shape: Shape | null) {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const scope = useRef(new paper.PaperScope());
    useEffect(() => {
        if (!shape || !canvas.current) return;
        console.log("Rendering shape:", shape);
        const myPaper = scope.current;
        myPaper.setup(canvas.current);
        myPaper.project.clear();
        const path = new myPaper.Path();
        path.strokeColor = new myPaper.Color('black');
        shape.draw(scope.current);
        return () => {
            shape.destroy();
            myPaper.project.clear();
        };
    }, [canvas, shape]);
    return {
        canvas,
        scope
    }
}