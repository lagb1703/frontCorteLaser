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
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const lineTool = this.context as LineTool;
        const hit = scope.project.hitTest(event.point, {
            fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });
        if (hit && hit.item) {
            const figure = hit.item;
            if (figure instanceof paper.Path) {
                const points = figure.segments.map(seg => seg.point);
                let closestPoint: paper.Point | null = null;
                let minDistance = Infinity;
                points.forEach(pt => {
                    const distance = pt.getDistance(event.point);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPoint = pt;
                    }
                });
                if (closestPoint) {
                    lineTool.fisrtPoint = closestPoint;
                    return;
                }
            }
        }
        const point = event.point;
        lineTool.fisrtPoint = point;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const lineTool = this.context as LineTool;
        const hit = scope.project.hitTest(event.point, {
            fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });
        if (hit && hit.item) {
            const figure = hit.item;
            if (figure instanceof paper.Path) {
                const segments = figure.segments;
                let closestSegment: paper.Segment | null = null;
                let minDistance = Infinity;
                for (const seg of segments) {
                    const distance = seg.point.getDistance(event.point);
                    seg.selected = false;
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSegment = seg;
                    }
                }
                if (closestSegment) {
                    (closestSegment as paper.Segment).selected = true;
                    lineTool.selectedItem = figure;
                }
            }
            return;
        }
        if(lineTool.selectedItem) {
            lineTool.selectedItem.selected = false;
            lineTool.selectedItem = null;
        }
    }

    nextState(): ToolState {
        return new LastLineState(this.context as LineTool);
    }
}

export class LastLineState implements ToolState {

    context: ToolInterface;

    constructor(context: LineTool) {
        this.context = context;
        if (context.selectedItem) {
            context.selectedItem.selected = false;
            context.selectedItem = null;
        }
    }

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const lineTool = this.context as LineTool;
        lineTool.ghostPath?.remove();
        const hit = scope.project.hitTest(event.point, {
            fill: true,
            stroke: true,
            segments: true,
            tolerance: 10,
        });
        if (hit && hit.item) {
            const figure = hit.item;
            if (figure instanceof paper.Path) {
                const segments = figure.segments;
                let closestSegment: paper.Segment | null = null;
                let minDistance = Infinity;
                for (const seg of segments) {
                    const distance = seg.point.getDistance(event.point);
                    seg.selected = false;
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSegment = seg;
                    }
                }
                if (closestSegment) {
                    lineTool.path = new paper.Path({
                        segments: [lineTool.fisrtPoint!, closestSegment.point],
                        strokeColor: drawService.getLayer()?.strokeColor || new paper.Color('black'),
                        selected: false
                    });
                    return;
                }
            }
        }
        lineTool.path = new paper.Path({
            segments: [lineTool.fisrtPoint!, event.point],
            strokeColor: drawService.getLayer()?.strokeColor || new paper.Color('black'),
            selected: false
        });
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const lineTool = this.context as LineTool;
        lineTool.ghostPath?.remove();
        const hit = scope.project.hitTest(event.point, {
            fill: true,
            stroke: true,
            segments: true,
            tolerance: 10,
        });
        if (hit && hit.item) {
            const figure = hit.item;
            if (figure instanceof paper.Path) {
                const segments = figure.segments;
                let closestSegment: paper.Segment | null = null;
                let minDistance = Infinity;
                for (const seg of segments) {
                    const distance = seg.point.getDistance(event.point);
                    seg.selected = false;
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSegment = seg;
                    }
                }
                if (closestSegment) {
                    lineTool.ghostPath = new paper.Path({
                        segments: [lineTool.fisrtPoint!, closestSegment.point],
                        strokeColor: 'gray',
                        dashArray: [4, 4],
                        selected: false
                    });
                    return;
                }
            }
        }
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