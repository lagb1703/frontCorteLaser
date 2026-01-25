import type { ToolInterface, ToolState } from "../interfaces";
import { DrawService } from "../service/drawService";
import { FirstLineState } from "./lineStates";
import { InitPolylineState } from "./polylineStates";
import { InitSemiCircleState } from "./semicircleState";
import paper from "paper";

export class ZoomTool implements ToolInterface {
    tool: paper.Tool | null = null;
    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (!scope || !canvas) return;
        this.tool = new scope.Tool();

        canvas.addEventListener('wheel', (event) => {
            if (!scope.project || !scope.view) return;
            event.preventDefault();
            const view = scope.view;
            const oldZoom = view.zoom;
            const factor = 1.05;
            const newZoom = event.deltaY < 0
                ? oldZoom * factor
                : oldZoom / factor;
            if (newZoom < drawService.zoomBounds.min || newZoom > drawService.zoomBounds.max) return;
            const mousePosition = view.viewToProject(
                new paper.Point(event.offsetX, event.offsetY)
            );
            const beta = oldZoom / newZoom;
            const mouseOffset = mousePosition.subtract(view.center);
            const newCenter = mousePosition.subtract(mouseOffset.multiply(beta));

            view.zoom = newZoom;
            view.center = newCenter;
            drawService.zoomFactor = newZoom;
        }, { passive: false });
    }
    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'default';
        }
        this.tool?.activate();
    }
}

export class PanTool implements ToolInterface {
    tool: paper.Tool | null = null;

    lastTool: paper.Tool | null = null;

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (!scope || !canvas) return;
        this.tool = new scope.Tool();
        const view = scope.view;

        document.addEventListener('keydown', (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }
            console.log("Global Key:", event.code);
            if (event.code === 'Space') {
                event.preventDefault();
                if (scope.tool !== this.tool) {
                    this.lastTool = scope.tool;
                    this.tool?.activate();
                    canvas.style.cursor = 'grab';
                }
                return;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (event.code === 'Space') {
                event.preventDefault();
                if (this.lastTool) {
                    this.lastTool.activate();
                    canvas.style.cursor = 'default';
                }
            }
        });
        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            const nativeEvent = (event as any).event as MouseEvent;
            const screenDelta = new paper.Point(nativeEvent.movementX, nativeEvent.movementY);
            const projectDelta = screenDelta.divide(view.zoom);
            view.center = view.center.subtract(projectDelta);
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'grab';
        }
        this.tool?.activate();
    }
}

export class RectangleTool implements ToolInterface {
    tool: paper.Tool | null = null;

    private path: paper.Path | null = null;

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();
        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.path = new scope.Path.Rectangle({
                point: event.point,
                size: [0, 0],
                strokeColor: 'black',
            });
        };

        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.path) {
                const rect = new scope.Rectangle(this.path.bounds.topLeft, event.point);
                this.path.remove();
                this.path = new scope.Path.Rectangle({
                    rectangle: rect,
                    strokeColor: 'black',
                });
            }
        };

        this.tool.onMouseUp = (event: paper.ToolEvent) => {
            this.path = null;
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.tool?.activate();
    }
}

export class SelectTool implements ToolInterface {
    tool: paper.Tool | null = null;
    private selectedItem: paper.Item | null = null;

    constructor() {
        this.tool = new paper.Tool();
    }

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            if (this.selectedItem) {
                this.selectedItem.selected = false;
                this.selectedItem.strokeColor = new paper.Color('black');
                this.selectedItem = null;
            }
            const hitResult = scope.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                segments: true,
                tolerance: 5,
            });
            if (hitResult && hitResult.item) {
                this.selectedItem = hitResult.item;
                this.selectedItem.selected = true;
                this.selectedItem.strokeColor = new paper.Color('red');
                return;
            }
        };
        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.selectedItem) {
                this.selectedItem.position = this.selectedItem.position.add(event.delta);
            }
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'default';
        }
        this.tool?.activate();
    }
}

export class CircleTool implements ToolInterface {
    tool: paper.Tool | null = null;

    private path: paper.Path | null = null;

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.path = new scope.Path.Circle({
                center: event.point,
                radius: 0,
                strokeColor: 'black',
            });
        };

        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.path) {
                const radius = event.point.getDistance(this.path.position);
                this.path.remove();
                this.path = new scope.Path.Circle({
                    center: this.path.position,
                    radius: radius,
                    strokeColor: 'black',
                });
            }
        };

        this.tool.onMouseUp = (_: paper.ToolEvent) => {
            this.path = null;
        };
    }

        activate(drawService: DrawService): void {
            const canvas: HTMLCanvasElement | null = drawService.getCanvas();
            if (canvas) {
                canvas.style.cursor = 'crosshair';
            }
        this.tool?.activate();
    }
}

export class LineTool implements ToolInterface {
    tool: paper.Tool | null = null;
    public path: paper.Path | null = null;
    public ghostPath: paper.Path | null = null;
    public state: ToolState = new FirstLineState(this);
    public fisrtPoint: paper.Point | null = null;

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();
        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.state.onMouseDown(event, drawService);
            this.state = this.state.nextState();
        };
        this.tool.onMouseMove = (event: paper.ToolEvent) => {
            this.state.onMouseMove(event, drawService);
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.tool?.activate();
    }
}

export class PolylineTool implements ToolInterface {
    tool: paper.Tool | null = null;
    public state: ToolState = new InitPolylineState(this);
    public path: paper.Path | null = null;
    public ghostPath: paper.Path | null = null;

    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();
        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.state.onMouseDown(event, drawService);
            this.state = this.state.nextState();
        };

        this.tool.onMouseMove = (event: paper.ToolEvent) => {
            this.state.onMouseMove(event, drawService);
        };
        this.tool.onKeyDown = (event: paper.KeyEvent) => {
            if (event.key === 'escape') {
                if (this.path) {
                    this.path.selected = false;
                    this.ghostPath?.remove();
                    this.path = null;
                    this.ghostPath = null;
                    this.state = new InitPolylineState(this);
                }
            }
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.tool?.activate();
    }
}

export class SemicircleTool implements ToolInterface {
    tool: paper.Tool | null = null;
    public state: ToolState = new InitSemiCircleState(this);
    public path: paper.Path | null = null;
    public ghostPath: paper.Path | null = null;
    public points: paper.Point[] = [new paper.Point(0, 0), new paper.Point(0, 0)];
    createTool(drawService: DrawService): void {
        const scope: paper.PaperScope | null = drawService.getPaper();
        if (!scope) return;
        this.tool = new scope.Tool();
        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.state.onMouseDown(event, drawService);
            this.state = this.state.nextState();
        };
        this.tool.onMouseMove = (event: paper.ToolEvent) => {
            this.state.onMouseMove(event, drawService);
        };
        this.tool.onKeyDown = (event: paper.KeyEvent) => {
            if (event.key === 'escape') {
                this.ghostPath?.remove();
                this.path = null;
                this.ghostPath = null;
                this.state = new InitSemiCircleState(this);
            }
        };
    }

    activate(drawService: DrawService): void {
        const canvas: HTMLCanvasElement | null = drawService.getCanvas();
        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.tool?.activate();
    }
}