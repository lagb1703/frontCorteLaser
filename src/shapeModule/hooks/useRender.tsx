import { useEffect, useRef } from "react";
import type { Shape } from "../interfaces";
import paper from "paper";

export function useRender(shape: Shape | null) {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const scope = useRef<paper.PaperScope | null>(new paper.PaperScope());
    useEffect(() => {
        if (!shape || !canvas.current || !scope.current) return;
        const myPaper = scope.current;
        myPaper.setup(canvas.current);
        myPaper.project.clear();

        const resizeHandler = () => {
            if (canvas.current?.parentElement) {
                const { clientWidth, clientHeight } = canvas.current.parentElement;
                myPaper.view.viewSize = new paper.Size(clientWidth, clientHeight);
            }
        };

        const resizeObserver = new ResizeObserver(resizeHandler);
        if (canvas.current.parentElement) {
            resizeObserver.observe(canvas.current.parentElement);
        }

        const path = new myPaper.Path();
        path.strokeColor = new myPaper.Color('black');
        shape.draw(scope.current);
        return () => {
            resizeObserver.disconnect();
            shape.destroy();
            myPaper.project.clear();
        };
    }, [canvas, shape, scope]);
    return {
        canvas,
        scope
    }
}