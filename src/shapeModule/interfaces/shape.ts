import type { Path } from "./path";
import _ from "paper";

export interface Shape {
    id: string;
    paths: Path[];
    getPaths(): Path[];
    draw(scope: paper.PaperScope): void;
    destroy(): void;
}