import type { Shape } from "../../interfaces";
import { PoligonPath } from "../paths/poligonPath";
export class PoligonShape implements Shape {
    id: string;
    paths: PoligonPath[];
    constructor() {
        this.id = "Poligon";
        this.paths = [
            new PoligonPath(`Poligon`, ["center", "center"], 50, 3)
        ];
    }
    getPaths(): PoligonPath[] {
        return this.paths;
    }
    draw(scope: paper.PaperScope): void {
        this.paths.forEach(path => path.draw(scope));
    }
    destroy(): void {
        this.paths.forEach(path => path.destroy());
        this.paths = [];
    }
}