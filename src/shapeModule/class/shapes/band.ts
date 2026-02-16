import type { Shape } from "../../interfaces";
import { BandPath } from "../paths/bandPath";
export class BandShape implements Shape {
    id: string;
    paths: BandPath[];
    constructor() {
        this.id = "band";
        this.paths = [
            new BandPath(`band`, ["center", "center"], 0, 10, 30, 20, 100)
        ];
    }
    getPaths(): BandPath[] {
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