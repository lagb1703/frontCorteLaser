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
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const polylineTool = this.context as PolylineTool;
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
                    polylineTool.ghostPath = new paper.Path({
                        segments: [closestPoint],
                        strokeColor: 'gray',
                        dashArray: [4, 4],
                        selected: true
                    });
                    polylineTool.path = new paper.Path({
                        segments: [closestPoint],
                        strokeColor: drawService.getLayer() ? drawService.getLayer().strokeColor : 'black',
                        selected: true
                    });
                    return;
                }
            }
        }
        polylineTool.ghostPath = new paper.Path({
            segments: [event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        polylineTool.path = new paper.Path({
            segments: [event.point],
            strokeColor: drawService.getLayer() ? drawService.getLayer().strokeColor : 'black',
            selected: true
        });
        return;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const polylineTool = this.context as PolylineTool;
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
                    polylineTool.selectedItem = figure;
                }
            }
            return;
        }
        if (polylineTool.selectedItem) {
            polylineTool.selectedItem.selected = false;
            polylineTool.selectedItem = null;
        }
    }

    nextState(): ToolState {
        return new EndPolylineState(this.context as PolylineTool);
    }
}

export class EndPolylineState implements ToolState {
    context: ToolInterface;
    constructor(context: PolylineTool) {
        this.context = context as ToolInterface;
        if (context.selectedItem) {
            context.selectedItem.selected = false;
            context.selectedItem = null;
        }
    }

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void {
        const tempPath = (this.context as PolylineTool).path;
        if (!tempPath) {
            (this.context as PolylineTool).state = this.nextState();
            return;
        };

        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const polylineTool = this.context as PolylineTool;
        polylineTool.ghostPath?.remove();
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
                console.log(closestSegment);
                if (closestSegment) {
                    tempPath.closed = true;
                    tempPath.selected = false;
                    polylineTool.ghostPath?.remove();
                    tempPath.add(closestSegment.point);
                    tempPath.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
                    polylineTool.path = tempPath;
                    return;
                }
            }
        }
        const startPoint = tempPath.firstSegment.point;
        if (event.point.getDistance(startPoint) < 20 && tempPath.segments.length > 2) {
            tempPath.closed = true;
            tempPath.selected = false;
            polylineTool.ghostPath?.remove();
            tempPath.add(startPoint);
            tempPath.strokeColor = drawService.getLayer()?.strokeColor || new paper.Color('black');
            polylineTool.path = tempPath;
            return;
        }
        tempPath.add(event.point);
        polylineTool.path = tempPath;
    }

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void {
        const scope = drawService.getPaper();
        if (!scope) {
            return;
        }
        const polylineTool = this.context as PolylineTool;
        polylineTool.ghostPath?.remove();
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
                    polylineTool.ghostPath = new paper.Path({
                        segments: [polylineTool.path?.lastSegment.point!, closestSegment.point],
                        strokeColor: 'gray',
                        dashArray: [4, 4],
                        selected: false
                    });
                    return;
                }
            }
        }
        let ghostPath = polylineTool.ghostPath;
        ghostPath?.remove();
        const startPoint = polylineTool.path?.firstSegment.point;
        if (startPoint && event.point.getDistance(startPoint) < 20 && polylineTool.path!.segments.length > 2) {
            ghostPath = new paper.Path({
                segments: [polylineTool.path?.lastSegment.point!, startPoint],
                strokeColor: 'gray',
                dashArray: [4, 4],
                selected: true
            });
            polylineTool.ghostPath = ghostPath;
            return;
        }
        ghostPath = new paper.Path({
            segments: [polylineTool.path?.lastSegment.point!, event.point],
            strokeColor: 'gray',
            dashArray: [4, 4],
            selected: true
        });
        polylineTool.ghostPath = ghostPath;
    }

    nextState(): ToolState {
        const polyline = this.context as PolylineTool;
        const path = polyline.path;
        if (path && path.closed) {
            return new InitPolylineState(this.context as PolylineTool);
        }
        return new EndPolylineState(this.context as PolylineTool);
    }
}
