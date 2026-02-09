import type { Shape } from "../../interfaces";
import type { Path } from "../../interfaces";
import { RectPath } from "../paths/rect";
import { CircumferencePath } from "../paths/circumference";

export class RectangleRingShape implements Shape {
    id: string;
    paths: Path[];
    constructor() {
        this.id = "rectangle-ring";
        const rect = new RectPath(`Rectangulo`, ["center", "center"], 80, 50);
        const circumference = new CircumferencePath(`Circunferencia`, ["center", "center"], 15);
        circumference.parent = rect;
        rect.paths.push(circumference);
        this.paths = [
            rect,
            circumference
        ];
    }
    getPaths(): Path[] {
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