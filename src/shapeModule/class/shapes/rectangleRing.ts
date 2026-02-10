import type { Shape } from "../../interfaces";
import type { Path } from "../../interfaces";
import { RectPath } from "../paths/rect";

export class RectangleRingShape implements Shape {
    id: string;
    paths: Path[];
    constructor() {
        this.id = "rectangle-ring";
        const rect = new RectPath(`Rectangulo externo`, ["center", "center"], 80, 50);
        const innerRect = new RectPath(`Rectangulo interno`, ["center", "center"], 50, 30);
        innerRect.parent = rect;
        rect.paths.push(innerRect);
        this.paths = [
            rect,
            innerRect
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