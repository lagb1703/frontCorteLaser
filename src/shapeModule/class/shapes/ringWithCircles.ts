import type { Shape } from "../../interfaces";
import { CirclesPath } from "../paths/circlesPath";

import { CircumferencePath } from "../paths/circumference";
export class RingWithCircles implements Shape {
    id: string;
    paths: (CircumferencePath | CirclesPath)[];
    constructor() {
        this.id = "ringWithCircles";
        let externalcircumference = new CircumferencePath(`Circuferencia externa`, ["center", "center"], 144);
        let circles = new CirclesPath(`Circulos`, ["center", "center"], 17, 4, 87, externalcircumference);
        let internalcircumference = new CircumferencePath(`Circuferencia interna`, ["center", "center"], 55, circles);
        externalcircumference.paths.push(internalcircumference);
        this.paths = [
            externalcircumference,
            internalcircumference,
            circles
        ];
    }
    getPaths(): (CircumferencePath | CirclesPath)[] {
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