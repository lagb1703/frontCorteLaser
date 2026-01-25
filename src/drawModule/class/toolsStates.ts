import type { ToolState, ToolInterface } from "../interfaces";
import type { DrawService } from "../service/drawService";
import type { PolylineTool, SemicircleTool } from "./tools";
import paper from "paper";

export class InitPolylineState implements ToolState {
    context: ToolInterface;
    constructor(context: PolylineTool) {
        this.context = context as ToolInterface;
    }

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        let path = new paper.Path({
            segments: [event.point],
            strokeColor: drawService.getLayer() ? drawService.getLayer().strokeColor : 'black',
            selected: true
        });
        let ghostPath = new paper.Path({
            segments: [event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        (this.context as PolylineTool).ghostPath = ghostPath;
        (this.context as PolylineTool).path = path;
        return;
    }

    onMouseMove(event: paper.ToolEvent, _: DrawService): void {
        let ghostPath = (this.context as PolylineTool).ghostPath;
        ghostPath?.remove();
        ghostPath = new paper.Path({
            segments: [(this.context as PolylineTool).path?.lastSegment.point!, event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        (this.context as PolylineTool).ghostPath = ghostPath;
    }

    nextState(): ToolState {
        return new EndPolylineState(this.context as PolylineTool);
    }
}

export class EndPolylineState implements ToolState {
    context: ToolInterface;
    constructor(context: PolylineTool) {
        this.context = context as ToolInterface;
    }

    onMouseDown(event: paper.ToolEvent, _: DrawService): void {
        const tempPath = (this.context as PolylineTool).path;
        if (!tempPath) {
            (this.context as PolylineTool).state = this.nextState();
            return;
        };
        const startPoint = tempPath.firstSegment.point;
        if (event.point.getDistance(startPoint) < 10) {
            tempPath.closed = true;
            tempPath.selected = false; // Deseleccionar al terminar
            (this.context as PolylineTool).ghostPath?.remove();
            (this.context as PolylineTool).path = null;
            (this.context as PolylineTool).ghostPath = null;
            (this.context as PolylineTool).state = this.nextState();
            return;
        }
        if (tempPath) {
            const startPoint = tempPath.firstSegment.point;
            if (event.point.getDistance(startPoint) < 10) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'crosshair';
            }
        }
        tempPath.add(event.point);
    }

    onMouseMove(event: paper.ToolEvent, _: DrawService): void {
        let ghostPath = (this.context as PolylineTool).ghostPath;
        ghostPath?.remove();
        ghostPath = new paper.Path({
            segments: [(this.context as PolylineTool).path?.lastSegment.point!, event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        (this.context as PolylineTool).ghostPath = ghostPath;
    }

    nextState(): ToolState {
        return new InitPolylineState(this.context as PolylineTool);
    }
}
