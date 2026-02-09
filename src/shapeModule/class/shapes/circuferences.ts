import type { Shape } from "../../interfaces";
import type { Path } from "../../interfaces";
import { RectPath } from "../paths/rect";
import { CirclesPath } from "../paths/circlesPath";

export class CircuferencesShape implements Shape {
    id: string;
    paths: Path[];
    constructor() {
        this.id = "circuferences";
        const rect = new RectPath(`Rectangulo`, ["center", "center"], 210, 130);
        const circles = new CirclesPath(`Circulos`, ["center", "center"], 15, 4, 40, rect);
        circles.parent = rect;
        rect.paths.push(circles);
        this.paths = [
            rect,
            circles
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