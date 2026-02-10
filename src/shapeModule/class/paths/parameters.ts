import type { Path } from "@/shapeModule/interfaces";
import _ from "paper";

export abstract class Parameters {
    protected value: number | string;
    protected path: Path;
    callback?: (value: number | string) => void;
    public willChange: boolean = true;
    constructor(value: number | string, path: Path) {
        this.value = value;
        this.path = path;
    }
    abstract min(scope?: paper.PaperScope): number;
    abstract max(scope?: paper.PaperScope): number;
    abstract getValue(): number | string;
    setValue(value: number | string, scope?: paper.PaperScope): void{
        this.value = value;
        if(this.callback) this.callback(value);
        if(scope) {
            this.path.update(scope);
        }
    }
    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.path.displayMeasure(parameter, scope);
    }
    setCallback(callback: (value: number | string) => void) {
        this.callback = callback;
    }
}