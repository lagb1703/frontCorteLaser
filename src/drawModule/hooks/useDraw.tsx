import { DrawService } from "../service/drawService";
import { useRef, useEffect, useCallback, useState } from "react";
import { useSaveFile } from "@/fileService/hooks";
import { useNavigate } from "react-router";
import { toast } from 'sonner';
import { v4 } from "uuid";
import type { ToolInterface } from "../interfaces";
import {
    ZoomTool,
    PanTool,
    RectangleTool,
    SelectTool,
    CircleTool,
    LineTool,
    PolylineTool,
    SemicircleTool,
    EraserTool
} from "../class/tools";

export function useDraw() {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawService = useRef<DrawService | null>(null);
    const toolsRef = useRef<Record<string, ToolInterface>>({
        zoom: new ZoomTool(),
        pan: new PanTool(),
        rectangle: new RectangleTool(),
        select: new SelectTool(),
        circle: new CircleTool(),
        line: new LineTool(),
        polyline: new PolylineTool(),
        semicircle: new SemicircleTool(),
        eraser: new EraserTool()
    });
    const [toolName, setToolName] = useState("");
    const [showGrid, setShowGrid] = useState(false);
    const saveFile = useSaveFile();
    useEffect(() => {
        let resizeObserver: ResizeObserver;
        if (canvasRef.current) {
            drawService.current = new DrawService(canvasRef.current);
            drawService.current.setUp(toolsRef.current);
            const handleResize = () => {
                const canvas = canvasRef.current;
                const service = drawService.current;

                if (canvas && canvas.parentElement && service) {
                    const { clientWidth, clientHeight } = canvas.parentElement;
                    canvas.width = clientWidth;
                    canvas.height = clientHeight;
                    const scope = service.getPaper();
                    if (scope) {
                        scope.view.viewSize = new scope.Size(clientWidth, clientHeight);
                    }
                }
            };
            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            if (canvasRef.current.parentElement) {
                resizeObserver.observe(canvasRef.current.parentElement);
            }
            handleResize();
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (drawService.current) {
                drawService.current.destroy();
            }
        };
    }, [canvasRef]);
    useEffect(() => {
        if (drawService.current && toolName) {
            drawService.current.setTool(toolName);
        }
    }, [drawService, toolName]);
    const save = useCallback(() => {
        if (drawService.current) {
            const id = toast.loading('Guardando DXF...');
            try {
                const data = drawService.current.saveFile();
                toast.success('DXF exportado con éxito!', { id });
                const formData = new FormData();
                formData.append("file", data, `${v4()}.dxf`);
                toast.loading('subiendo archivo...', { id });
                saveFile.mutate(formData);
                toast.success('Archivo subido con éxito!', { id });
                setTimeout(() => {
                    navigate('/files');
                }, 1000);
                // const url = window.URL.createObjectURL(data);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = "prueba.dxf";
                // document.body.appendChild(a);
                // a.click();
                // a.remove();
                // window.URL.revokeObjectURL(url);
            } catch (error) {
                toast.error('Error al exportar el DXF.', { id });
            }
        }
    }, [drawService, saveFile]);

    const toggleGrid = useCallback((checked: boolean) => {
        setShowGrid(checked);
        if (drawService.current) {
            drawService.current.toggleGrid(checked);
        }
    }, [drawService]);

    return {
        canvasRef,
        toolName,
        setToolName,
        save,
        tools: toolsRef.current,
        drawService,
        showGrid,
        toggleGrid
    };
}