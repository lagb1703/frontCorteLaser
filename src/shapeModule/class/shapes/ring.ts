import type { Shape } from "../../interfaces";
import { CircumferencePath } from "../paths/circumference";
export class RingShape implements Shape {
    id: string;
    paths: CircumferencePath[];
    constructor() {
        this.id = "ring";
        let externalcircumference = new CircumferencePath(`Circuferencia externa`, ["center", "center"], 20);
        let internalcircumference = new CircumferencePath(`Circuferencia interna`, ["center", "center"], 10);
        internalcircumference.parent = externalcircumference;
        externalcircumference.paths.push(internalcircumference);
        this.paths = [
            externalcircumference,
            internalcircumference
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