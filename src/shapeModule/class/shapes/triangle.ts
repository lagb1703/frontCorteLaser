import type { Shape } from "../../interfaces";
import { TrianglePath } from "../paths/trianglePath";
export class TriangleShape implements Shape {
    id: string;
    paths: TrianglePath[];
    constructor() {
        this.id = "triangle";
        this.paths = [
            new TrianglePath(`triangle`, ["center", "center"], 100, 100, 5)
        ];
    }
    getPaths(): TrianglePath[] {
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