import type { Shape } from "../../interfaces";
import { RectPath } from "../paths/rect";

export class RectangleWithRectBorder implements Shape {
    id: string;
    paths: RectPath[];
    constructor() {
        this.id = "rectangleWithRectBorder";
        this.paths = [
            new RectPath(`Rectangulo`, ["center", "center"], 233, 144, 27, "rect")
        ];
    }
    getPaths(): RectPath[] {
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