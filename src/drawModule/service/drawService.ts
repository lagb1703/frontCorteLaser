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
    
    private gridLayer: paper.Layer | null = null;

    private currectLayer: number = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scope = new paper.PaperScope();
        this.scope.setup(this.canvas);
        this.scope
    }

    public destroy(): void {
        if (this.scope) {
            this.scope.project?.remove();
            this.scope.view?.remove();
            this.scope = null;
        }
        if(this.canvas && this.canvas.parentNode){
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
        console.log("Setting zoom to:", newZoom);
        if (newZoom < this.zoomBounds.min || newZoom > this.zoomBounds.max) return;
        console.log("Zoom applied:", newZoom);
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
            this.drawGrid();
            this.gridLayer.sendToBack();
            // Reactivar la capa de dibujo principal
            if (this.layers[this.currectLayer]) {
                this.layers[this.currectLayer].activate();
            }
        }
        this.gridLayer.visible = visible;
    }

    private drawGrid(): void {
        if (!this.scope || !this.gridLayer) return;
        this.gridLayer.activate();

        // Limpiar cuadrícula existente si hubiera
        this.gridLayer.removeChildren();
        
        // Área de la cuadrícula (ej: 500x500 mm en cada dirección desde el centro)
        const size = 500;
        const step = 10; // Celdas grandes cada 10 unidades (cm)
        const subStep = 1; // Celdas pequeñas cada 1 unidad (mm)
        
        // Colores
        const gridColor = new this.scope.Color('#e0e0e0');
        const subGridColor = new this.scope.Color('#f0f0f0');
        
        // Dibujamos lineas
        for (let i = -size; i <= size; i += subStep) {
            // Saltamos las lineas que coinciden con el paso mayor para no sobrescribir o duplicar demasiado
            if (i % step === 0) continue;

            const vLine = new this.scope.Path.Line(
                new this.scope.Point(i, -size),
                new this.scope.Point(i, size)
            );
            vLine.strokeColor = subGridColor;
            vLine.strokeWidth = 0.5;
            // Optimización: hacerlas guías para que no interfieran en hitTests si fuera necesario, 
            // aunque al estar en otra capa y bloqueada/fondo suele bastar.

            const hLine = new this.scope.Path.Line(
                new this.scope.Point(-size, i),
                new this.scope.Point(size, i)
            );
            hLine.strokeColor = subGridColor;
            hLine.strokeWidth = 0.5;
        }

        for (let i = -size; i <= size; i += step) {
             const vLine = new this.scope.Path.Line(
                new this.scope.Point(i, -size),
                new this.scope.Point(i, size)
            );
            vLine.strokeColor = gridColor;
            vLine.strokeWidth = 1;

            const hLine = new this.scope.Path.Line(
                new this.scope.Point(-size, i),
                new this.scope.Point(size, i)
            );
            hLine.strokeColor = gridColor;
            hLine.strokeWidth = 1;
        }

        // Ejes opcionales no solicitados, pero útiles. Los omito para ceñirme a "cuadricula" simple.
    }

    public saveFile(): Blob{
        if (!this.scope) throw new Error('Paper scope is not initialized');
        const svgString = this.scope.project.exportSVG({ asString: false }) as SVGElement;
        const original = {paths: {} as Record<string, makerjs.IPath>} as makerjs.IModel;
        if(!original || !original.paths) throw new Error('Error creating makerjs model');
        for(let i = 0; i < svgString.children.length; i++){
            const g = svgString.children[i];
            for(let j = 0; j < g.children.length; j++){
                const path = g.children[j];
                console.log(path.getAttribute('d'));
                const makerModel = makerjs.importer.fromSVGPathData(path.getAttribute('d') || '');
                if(!makerModel.paths) continue;
                const lines = Object.keys(makerModel.paths)
                for(let k in Object.keys(makerModel.paths)){
                    original.paths[`path_${i}_${j}`] = makerModel.paths[lines[k]];
                }
            }
        }
        const dxfString = makerjs.exporter.toDXF(original, {
             units: makerjs.unitType.Millimeter
        });
        return new Blob([dxfString], { type: 'application/dxf' });
    }
}