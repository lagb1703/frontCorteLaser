import type { Path } from "@/shapeModule/interfaces";
import _ from "paper";

export abstract class Parameters {
    protected value: number | string;
    protected path: Path;
    public willChange: boolean = true;
    constructor(value: number | string, path: Path) {
        this.value = value;
        this.path = path;
    }
    abstract min(scope?: paper.PaperScope): number;
    abstract max(scope?: paper.PaperScope): number;
    abstract getValue(): number | string;
    abstract setValue(value: number | string, scope?: paper.PaperScope): void;
}