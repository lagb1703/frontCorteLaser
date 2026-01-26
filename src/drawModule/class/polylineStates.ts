import type { ToolState, ToolInterface } from "../interfaces";
import type { DrawService } from "../service/drawService";
import type { PolylineTool } from "./tools";
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

    onMouseMove(_: paper.ToolEvent, __: DrawService): void {
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

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const tempPath = (this.context as PolylineTool).path;
        if (!tempPath) {
            (this.context as PolylineTool).state = this.nextState();
            return;
        };
        (this.context as PolylineTool).ghostPath?.remove();
        const startPoint = tempPath.firstSegment.point;
        if (event.point.getDistance(startPoint) < 20 && tempPath.segments.length > 2) {
            tempPath.closed = true;
            tempPath.selected = false;
            (this.context as PolylineTool).ghostPath?.remove();
            tempPath.add(startPoint);
            tempPath.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
            (this.context as PolylineTool).path = tempPath;
            return;
        }
        tempPath.add(event.point);
        (this.context as PolylineTool).path = tempPath;
    }

    onMouseMove(event: paper.ToolEvent, _: DrawService): void {
        let ghostPath = (this.context as PolylineTool).ghostPath;
        ghostPath?.remove();
        const startPoint = (this.context as PolylineTool).path?.firstSegment.point;
        if (startPoint && event.point.getDistance(startPoint) < 20 && (this.context as PolylineTool).path!.segments.length > 2) {
            ghostPath = new paper.Path({
                segments: [(this.context as PolylineTool).path?.lastSegment.point!, startPoint],
                strokeColor: 'gray',
                dashArray: [4, 4],
                selected: true
            });
            (this.context as PolylineTool).ghostPath = ghostPath;
            return;
        }
        ghostPath = new paper.Path({
            segments: [(this.context as PolylineTool).path?.lastSegment.point!, event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        (this.context as PolylineTool).ghostPath = ghostPath;
    }

    nextState(): ToolState {
        const polyline = this.context as PolylineTool;
        const path = polyline.path;
        if (path) {
            if (path.closed) {
                return new InitPolylineState(this.context as PolylineTool);
            }
        }
        return new EndPolylineState(this.context as PolylineTool);
    }
}
