import type { Path } from "./path";


export interface Shape {
    id: string;
    paths: Path[];
    getPaths(): Path[];
    draw(scope: paper.PaperScope): void;
    destroy(): void;
}