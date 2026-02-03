import type { Parameters } from "./parameter";
import _ from "paper";

export interface Path {
    id: string;
    parameters: Record<string, Parameters>;
    paths: Path[];
    cords: number[];
    isRelative: boolean;
    parent: Path | null;
    draw(scope: paper.PaperScope): void;
    getParameters(): Record<string, any>;
    destroy(): void;
}