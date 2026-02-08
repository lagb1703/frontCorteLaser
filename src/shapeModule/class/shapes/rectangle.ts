import type { Shape } from "../../interfaces";
import { RectPath } from "../paths/rect";

export class RectangleShape implements Shape {
    id: string;
    paths: RectPath[];
    constructor() {
        this.id = "rectangle";
        this.paths = [
            new RectPath(`Rectangulo`, ["center", "center"], 80, 50)
        ];
    }
    getPaths(): RectPath[] {
        return this.paths;
    }
    draw(scope: paper.PaperScope): void {
        console.log("Drawing RectangleShape");
        this.paths.forEach(path => path.draw(scope));
    }
    destroy(): void {
        this.paths.forEach(path => path.destroy());
        this.paths = [];
    }
}