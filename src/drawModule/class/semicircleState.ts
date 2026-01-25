import type { ToolState, ToolInterface } from "../interfaces";
import type { DrawService } from "../service/drawService";
import type { SemicircleTool } from "./tools";
import paper from "paper";

export class InitSemiCircleState implements ToolState {
    context: ToolInterface;
    constructor(context: SemicircleTool) {
        this.context = context;
    }
    onMouseDown(event: paper.ToolEvent, _: DrawService): void {
        console.log("InitSemiCircleState - onMouseDown");
        (this.context as SemicircleTool).points[0] = event.point;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        
    }

    nextState(): ToolState {
        return new SecondClickSemiCircleState(this.context as SemicircleTool);
    }
}

export class SecondClickSemiCircleState implements ToolState {
    context: ToolInterface;
    constructor(context: SemicircleTool) {
        this.context = context as ToolInterface;
    }
    onMouseDown(event: paper.ToolEvent, _: DrawService): void {
        console.log("SecondClickSemiCircleState - onMouseDown");
        (this.context as SemicircleTool).points[1] = event.point;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        
    }

    nextState(): ToolState {
        return new LastCircleState(this.context as SemicircleTool);
    }
}

export class LastCircleState implements ToolState {
    context: ToolInterface;
    constructor(context: SemicircleTool) {
        this.context = context;
    }
    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        console.log("LastCircleState - onMouseDown");
        const points = (this.context as SemicircleTool).points;
        const arc = new paper.Path.Arc(points[0], points[1], event.point);
        arc.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
        (this.context as SemicircleTool).path = arc;
        (this.context as SemicircleTool).ghostPath?.remove();
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const points = (this.context as SemicircleTool).points;
        console.log("Points:", [points[0], points[1], event.point]);
        const arc = new paper.Path.Arc(points[0], points[1], event.point);
        arc.strokeColor = new paper.Color('gray');
        arc.dashArray = [4, 4];
        (this.context as SemicircleTool).ghostPath?.remove();
        (this.context as SemicircleTool).ghostPath = arc;
    }

    nextState(): ToolState {
        return new InitSemiCircleState(this.context as SemicircleTool);
    }
}