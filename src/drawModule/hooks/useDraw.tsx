import { DrawService } from "../service/drawService";
import { useRef, useEffect, useCallback, useState } from "react";
import { useSaveFile } from "@/fileService/hooks";
import type { ToolInterface } from "../interfaces";
import {
    ZoomTool,
    PanTool,
    RectangleTool,
    SelectTool,
    CircleTool,
    LineTool,
    PolylineTool,
    SemicircleTool
} from "../class/tools";

export function useDraw() {
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
        semicircle: new SemicircleTool()
    });
    const [toolName, setToolName] = useState("");
    const saveFile = useSaveFile();
    useEffect(() => {
        console.log("Canvas ref changed:", canvasRef.current);
        if (canvasRef.current) {
            drawService.current = new DrawService(canvasRef.current);
            drawService.current.setUp(toolsRef.current);
        }
        return () => {
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
            const data = drawService.current.saveFile();
            console.log(data);
            const formData = new FormData();
            formData.append("file", data, "drawing.dxf");
            // saveFile.mutate(formData);
        }
    }, [drawService, saveFile]);
    return {
        canvasRef,
        setToolName,
        save,
        tools: toolsRef.current,
    };
}