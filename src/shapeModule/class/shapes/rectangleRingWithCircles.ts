import type { Shape } from "../../interfaces";
import { CirclesPath } from "../paths/circlesPath";
import { CircumferencePath } from "../paths/circumference";
import { RectPath } from "../paths/rect";

export class RectangleRingWithCircles implements Shape {
    id: string;
    paths: (CircumferencePath | CirclesPath | RectPath)[];
    constructor() {
        this.id = "rectangleRingWithCircles";
        let externalRect = new RectPath(`Rectángulo externo`, ["center", "center"], 377, 233);
        let circles = new CirclesPath(`Circulos`, ["center", "center"], 17, 4, 87, externalRect);
        let internalcircumference = new CircumferencePath(`Circuferencia interna`, ["center", "center"], 55, circles);
        externalRect.paths.push(internalcircumference);
        this.paths = [
            externalRect,
            internalcircumference,
            circles
        ];
    }
    getPaths(): (CircumferencePath | CirclesPath | RectPath)[] {
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