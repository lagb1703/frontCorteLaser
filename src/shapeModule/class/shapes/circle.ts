import type { Shape } from "../../interfaces";
import { CircumferencePath } from "../paths/circumference";
export class CircleShape implements Shape {
    id: string;
    paths: CircumferencePath[];
    constructor() {
        this.id = "circle";
        this.paths = [
            new CircumferencePath(`circumference`, 0)
        ];
    }
    getPaths(): CircumferencePath[] {
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