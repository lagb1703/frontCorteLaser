import type { Shape } from "../../interfaces";
import { CircumferencePath } from "../paths/circumference";
export class CircleShape implements Shape {
    id: string;
    paths: CircumferencePath[];
    constructor() {
        this.id = "circle";
        this.paths = [
            new CircumferencePath(`circumference`, 5)
        ];
    }
    getPaths(): CircumferencePath[] {
        return this.paths;
    }
    draw(scope: paper.PaperScope): void {
        console.log("Drawing CircleShape");
        this.paths.forEach(path => path.draw(scope));
    }
    destroy(): void {
        this.paths.forEach(path => path.destroy());
        this.paths = [];
    }
}