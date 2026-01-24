import type { ToolInterface } from '../interfaces';
import makerjs from 'makerjs';
import paper from 'paper';

export class DrawService {

    private tools: Record<string, ToolInterface> = {};

    private canvas: HTMLCanvasElement | null = null;

    private scope: paper.PaperScope | null = null;

    public zoomBounds = Object.freeze({ min: 0.1, max: 10 });

    public zoomFactor: number = 1;

    private layers: paper.Layer[] = [];

    private currectLayer: number = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scope = new paper.PaperScope();
        this.scope.setup(this.canvas);
    }

    public destroy(): void {
        if (this.scope) {
            console.log("Destroying Paper scope");
            // this.scope.remove();
            this.scope = null;
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
        console.log(this.scope?.tools);
        console.log(this.scope?.tool);
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
    }

    public setLayer(index: number): void {
        if (index < 0 || index >= this.layers.length) return;
        this.currectLayer = index;
        this.layers[index].activate();
    }

    public getLayer(): paper.Layer {
        return this.layers[this.currectLayer];
    }

    public saveFile(): Blob{
        if (!this.scope) throw new Error('Paper scope is not initialized');
        const svgString = this.scope.project.exportSVG({ asString: false });

        console.log(svgString);

        // const makerModel = (makerjs.importer as any).fromSVGString(svgString);

        // const dxfString = makerjs.exporter.toDXF(makerModel, {
        //      units: makerjs.unitType.Millimeter
        // });

        return new Blob([], { type: 'application/dxf' });
    }
}