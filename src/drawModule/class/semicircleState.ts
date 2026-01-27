import type { ToolState, ToolInterface } from "../interfaces";
import type { DrawService } from "../service/drawService";
import type { SemicircleTool } from "./tools";
import paper from "paper";

export class InitSemiCircleState implements ToolState {
    context: ToolInterface;
    constructor(context: SemicircleTool) {
        this.context = context;
    }
    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const semicircleTool = this.context as SemicircleTool;
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
                    semicircleTool.points[0] = closestPoint;
                    return;
                }
            }
        }
        semicircleTool.points[0] = event.point;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const semicircleTool = this.context as SemicircleTool;
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
                    semicircleTool.selectedItem = figure;
                }
            }
            return;
        }
        if(semicircleTool.selectedItem) {
            semicircleTool.selectedItem.selected = false;
            semicircleTool.selectedItem = null;
        }
    }

    nextState(): ToolState {
        return new SecondClickSemiCircleState(this.context as SemicircleTool);
    }
}

export class SecondClickSemiCircleState implements ToolState {
    context: ToolInterface;
    constructor(context: SemicircleTool) {
        this.context = context as ToolInterface;
        if (context.selectedItem) {
            context.selectedItem.selected = false;
            context.selectedItem = null;
        }
    }
    onMouseDown(event: paper.ToolEvent, _: DrawService): void {
        const semicircleTool = this.context as SemicircleTool;
        semicircleTool.points[1] = event.point;
    }

    onMouseMove(_: paper.ToolEvent, __: DrawService): void {
        
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
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const semicircleTool = this.context as SemicircleTool;
        semicircleTool.ghostPath?.remove();
        const points = semicircleTool.points;
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
                    semicircleTool.path = new paper.Path.Arc(points[0], points[1], closestSegment.point);
                    semicircleTool.path.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
                    return;
                }
            }
        }
        const arc = new paper.Path.Arc(points[0], points[1], event.point);
        arc.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
        semicircleTool.path = arc;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const semicircleTool = this.context as SemicircleTool;
        const points = semicircleTool.points;
        semicircleTool.ghostPath?.remove();
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
                    semicircleTool.ghostPath = new paper.Path.Arc(points[0], points[1], closestSegment.point);
                    semicircleTool.ghostPath.strokeColor = new paper.Color('gray');
                    return;
                }
            }
        }
        const arc = new paper.Path.Arc(points[0], points[1], event.point);
        arc.strokeColor = new paper.Color('gray');
        arc.dashArray = [4, 4];
        semicircleTool.ghostPath = arc;
    }

    nextState(): ToolState {
        return new InitSemiCircleState(this.context as SemicircleTool);
    }
}