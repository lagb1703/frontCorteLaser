import type { Parameters } from "./../class/paths/parameters";
import _ from "paper";

export interface Path {
    id: string;
    parameters: Record<string, Parameters>;
    paths: Path[];
    cords: (number | "start" | "center" | "end")[];
    parent: Path | null;
    path: paper.Path | null;
    update(scope: paper.PaperScope): void;
    draw(scope: paper.PaperScope): void;
    getParameters(): Record<string, Parameters>;
    destroy(): void;
}