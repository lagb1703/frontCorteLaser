import type { ToolInterface } from '../interfaces';
import makerjs from 'makerjs';
import paper from 'paper';

export class DrawService {

    private tools: Record<string, ToolInterface> = {};

    private canvas: HTMLCanvasElement | null = null;

    private scope: paper.PaperScope | null = null;

    public zoomBounds = Object.freeze({ min: 0.1, max: 6 });

    public zoomFactor: number = 1;

    private layers: paper.Layer[] = [];

    private gridLayer: paper.Layer | null = null;

    private lastBounds: paper.Rectangle | null = null;

    private currectLayer: number = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scope = new paper.PaperScope();
        this.scope.setup(this.canvas);
    }

    public destroy(): void {
        if (this.scope) {
            this.scope.project?.remove();
            this.scope.view?.remove();
            this.scope = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            const clone = this.canvas.cloneNode(true) as HTMLCanvasElement;
            this.canvas.parentNode.replaceChild(clone, this.canvas);
        }
    }

    public setUp(tools: Record<string, ToolInterface>): void {
        this.layers.push(new paper.Layer());
        this.tools = tools;
        Object.values(this.tools).forEach((tool) => {
            tool.createTool(this);
        });
    }

    public getCanvas(): HTMLCanvasElement | null {
        return this.canvas;
    }

    public getPaper(): paper.PaperScope | null {
        return this.scope;
    }

    public addTool(name: string, tool: ToolInterface): void {
        this.tools[name] = tool;
        tool.createTool(this);
    }

    public setTool(name: string): void {
        const tool = this.tools[name];
        if (tool) {
            tool.activate(this);
        }
    }

    public setZoom(factor: number): void {
        if (!this.scope) return;
        const newZoom = this.zoomFactor * factor;
        if (newZoom < this.zoomBounds.min || newZoom > this.zoomBounds.max) return;
        this.zoomFactor = newZoom;
        this.scope.view.zoom = this.zoomFactor;
    }

    public resetZoom(): void {
        if (!this.scope) return;
        this.zoomFactor = 1;
        this.scope.view.zoom = this.zoomFactor;
        this.scope.view.center = new paper.Point(
            this.scope.view.size.width / 2,
            this.scope.view.size.height / 2
        );
    }

    public setLayer(index: number): void {
        if (index < 0 || index >= this.layers.length) return;
        this.currectLayer = index;
        this.layers[index].activate();
    }

    public getLayer(): paper.Layer {
        return this.layers[this.currectLayer];
    }

    public toggleGrid(visible: boolean): void {
        if (!this.scope) return;
        if (!this.gridLayer) {
            this.gridLayer = new this.scope.Layer();
            this.gridLayer.name = 'grid';
            this.gridLayer.locked = true;
            this.gridLayer.sendToBack();
            this.scope.view.on('frame', () => {
                if (this.gridLayer && this.gridLayer.visible) {
                    this.updateGrid();
                }
            });
            if (this.layers[this.currectLayer]) {
                this.layers[this.currectLayer].activate();
            }
        }
        this.gridLayer.visible = visible;
        if (visible) {
            this.updateGrid();
        }
    }

    private updateGrid(): void {
        if (!this.scope || !this.gridLayer) return;

        const bounds = this.scope.view.bounds;
        if (this.lastBounds &&
            Math.abs(this.lastBounds.x - bounds.x) < 1 &&
            Math.abs(this.lastBounds.y - bounds.y) < 1 &&
            Math.abs(this.lastBounds.width - bounds.width) < 1 &&
            Math.abs(this.lastBounds.height - bounds.height) < 1) {
            return;
        }
        this.lastBounds = bounds.clone();
        this.gridLayer.removeChildren();
        const step = 10;
        const gridColor = new this.scope.Color('#e0e0e0');
        const expanded = bounds.expand(step * 2);
        const startX = Math.floor(expanded.left / step) * step;
        const endX = Math.ceil(expanded.right / step) * step;
        const startY = Math.floor(expanded.top / step) * step;
        const endY = Math.ceil(expanded.bottom / step) * step;
        const lines: paper.Path[] = [];
        for (let i = startX; i <= endX; i += step) {
            const vLine = new this.scope.Path.Line(
                new this.scope.Point(i, startY),
                new this.scope.Point(i, endY)
            );
            vLine.strokeColor = gridColor;
            vLine.strokeWidth = 1;
            vLine.locked = true;
            lines.push(vLine);
        }
        for (let i = startY; i <= endY; i += step) {
            const hLine = new this.scope.Path.Line(
                new this.scope.Point(startX, i),
                new this.scope.Point(endX, i)
            );
            hLine.strokeColor = gridColor;
            hLine.strokeWidth = 1;
            hLine.locked = true;
            lines.push(hLine);
        }
        this.gridLayer.addChildren(lines);
    }

    public saveFile(): Blob {
        if (!this.scope) throw new Error('Paper scope is not initialized');
        const wasGridVisible = this.gridLayer ? this.gridLayer.visible : false;
        if (this.gridLayer) {
            this.gridLayer.visible = false;
        }
        const svg = this.scope.project.exportSVG({ asString: false }) as SVGElement;
        if (this.gridLayer) {
            this.gridLayer.visible = wasGridVisible;
        }
        const original = { paths: {} as Record<string, makerjs.IPath>, models: {} as Record<string, makerjs.IModel> } as makerjs.IModel;
        if (!original || !original.paths || !original.models) throw new Error('Error creating makerjs model');
        const queue: Element[] = Array.from(svg.children);
        let i = 0;
        let j = 0;
        while (queue.length > 0 && i < 10) {
            const element = queue.pop();
            if (!element) break;
            if (element.children && element.children.length > 0) {
                for (let k = 0; k < element.children.length; k++) {
                    queue.push(element.children[k]);
                }
                i++;
                continue;
            }
            const makerModel = makerjs.importer.fromSVGPathData(element.getAttribute('d') || '', {
                bezierAccuracy: 0.3
            });
            if (makerModel.paths) {
                const lines = Object.keys(makerModel.paths)
                for (let k = 0; k < lines.length; k++) {
                    original.paths[`path_${i}_${j}_${k}`] = makerModel.paths[lines[k]];
                }
            }
            if (makerModel.models) {
                const curves = Object.keys(makerModel.models)
                for (let k = 0; k < curves.length; k++) {
                    original.models[`path_${i}_${j}_${k}`] = makerModel.models[curves[k]];
                }
            }
            j++;
        }
        const dxfString = makerjs.exporter.toDXF(original, {
            units: makerjs.unitType.Millimeter
        });
        return new Blob([dxfString], { type: 'application/dxf' });
    }
}