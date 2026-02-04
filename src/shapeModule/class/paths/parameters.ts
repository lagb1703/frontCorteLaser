import type { Path } from "@/shapeModule/interfaces";
import _ from "paper";

export abstract class Parameters {
    protected value: number | string;
    protected path: Path;
    constructor(value: number | string, path: Path) {
        this.value = value;
        this.path = path;
    }
    abstract min(): number | string;
    abstract max(): number | string;
    abstract getValue(): number | string;
    abstract setValue(value: number | string, scope: paper.PaperScope): void;
}