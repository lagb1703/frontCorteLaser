import type { Path } from "./path";
import _ from "paper";

export interface Shape {
    id: string;
    paths: Path[];
    getPaths(): Path[];
    draw(scope: paper.PaperScope): void;
    getPosition(scope: paper.PaperScope): number[];
    destroy(): void;
}