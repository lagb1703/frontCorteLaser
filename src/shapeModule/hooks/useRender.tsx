import { useEffect, useRef, useCallback } from "react";
import makerjs from 'makerjs';
import { toast } from 'sonner';
import type { Shape } from "../interfaces";
import { useSaveFile } from "@/fileService/hooks";
import paper from "paper";
import { v4 } from "uuid";
import { useNavigate } from "react-router";

export function useRender(shape: Shape | null) {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const scope = useRef<paper.PaperScope | null>(new paper.PaperScope());
    const saveFile = useSaveFile();
    const navigate = useNavigate();
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
    const save = useCallback(() => {
        if (!shape || !scope.current) return null;
        const id = toast.loading('Guardando DXF...');
        const svg = scope.current.project.exportSVG({ asString: false }) as SVGElement;
        const queue: Element[] = Array.from(svg.children);
        const original = { paths: {} as Record<string, makerjs.IPath>, models: {} as Record<string, makerjs.IModel> } as makerjs.IModel;
        if (!original || !original.paths || !original.models) throw new Error('Error creating makerjs model');
        let i = 0;
        let j = 0;
        while (queue.length > 0 && i < 10) {
            const element = queue.pop();
            if (!element) break;
            if (element.children && element.children.length > 0) {
                for (let k = 0; k < element.children.length; k++) {
                    queue.push(element.children[k]);
                }
                i++;
                continue;
            }
            const makerModel = makerjs.importer.fromSVGPathData(element.getAttribute('d') || '', {
                bezierAccuracy: 0.3
            });
            if (makerModel.paths) {
                const lines = Object.keys(makerModel.paths)
                for (let k = 0; k < lines.length; k++) {
                    original.paths[`path_${i}_${j}_${k}`] = makerModel.paths[lines[k]];
                }
            }
            if (makerModel.models) {
                const curves = Object.keys(makerModel.models)
                for (let k = 0; k < curves.length; k++) {
                    original.models[`path_${i}_${j}_${k}`] = makerModel.models[curves[k]];
                }
            }
            j++;
        }
        const dxfString = makerjs.exporter.toDXF(original, {
            units: makerjs.unitType.Millimeter
        });
        const data = new Blob([dxfString], { type: 'application/dxf' });
        toast.success('DXF exportado con éxito!', { id });
        const formData = new FormData();
        formData.append("file", data, `${v4()}.dxf`);
        toast.loading('subiendo archivo...', { id });
        saveFile.mutate(formData);
        toast.success('Archivo subido con éxito!', { id });
        setTimeout(() => {
            navigate('/files');
        }, 1000);
    }, [shape, canvas, scope, saveFile, navigate]);
    return {
        canvas,
        scope,
        save
    }
}