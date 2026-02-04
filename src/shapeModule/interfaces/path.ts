import type { Parameters } from "./parameter";
import _ from "paper";

export interface Path {
    id: string;
    parameters: Record<string, Parameters>;
    paths: Path[];
    cords: (number | "start" | "center" | "end")[];
    isRelative: boolean;
    parent: Path | null;
    draw(scope: paper.PaperScope): void;
    getParameters(): Record<string, Parameters>;
    destroy(): void;
}