import type { ToolInterface, ToolState } from "../interfaces";
import type { DrawService } from "../service/drawService";
import { LineTool } from "./tools";
import paper from "paper";

export class FirstLineState implements ToolState {

    context: ToolInterface;

    constructor(context: LineTool) {
        this.context = context;
    }

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const point = event.point;
        const lineTool = this.context as LineTool;
        lineTool.fisrtPoint = point;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
    }

    nextState(): ToolState {
        return new LastLineState(this.context as LineTool);
    }
}

export class LastLineState implements ToolState {

    context: ToolInterface;

    constructor(context: LineTool) {
        this.context = context;
    }

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const lineTool = this.context as LineTool;
        lineTool.ghostPath?.remove();
        const path = new paper.Path({
            segments: [lineTool.fisrtPoint!, event.point],
            strokeColor: drawService.getLayer()?.strokeColor || new paper.Color('black'),
            selected: false
        });
        lineTool.path = path;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const lineTool = this.context as LineTool;
        lineTool.ghostPath?.remove();
        lineTool.ghostPath = new paper.Path({
            segments: [lineTool.fisrtPoint!, event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: false
        });
    }

    nextState(): ToolState {
        return new FirstLineState(this.context as LineTool);
    }
}