import type { Path } from "@/shapeModule/interfaces";
import { Parameters } from "./parameters";

function getPosition(currentCords: (number | "start" | "center" | "end")[], width: number, height: number): number[] {
    let x = 0;
    switch (currentCords[0]) {
        case "start":
            x = 0;
            break;
        case "center":
            x = width / 2;
            break;
        case "end":
            x = width;
            break;
        default:
            x = currentCords[0];
    }
    let y = 0;
    switch (currentCords[1]) {
        case "start":
            y = 0;
            break;
        case "center":
            y = height / 2;
            break;
        case "end":
            y = height;
            break;
        default:
            y = currentCords[1];
    }
    return [x, y];
}

export abstract class BasicPath implements Path {
    id: string;
    parameters: Record<string, Parameters>;
    paths: Path[];
    cords: (number | "start" | "center" | "end")[];
    parent: BasicPath | null;
    path: paper.Path | null = null;
    selectParameter: string = "";
    constructor(id: string, parent: BasicPath | null = null) {
        this.id = id;
        this.parameters = {
            "width": new WidthParameter(1, this),
            "height": new HeightParameter(1, this)
        };
        this.paths = [];
        this.cords = [0, 0];
        this.parent = parent;
    }
    abstract update(scope: paper.PaperScope): void;
    abstract draw(scope: paper.PaperScope): void;
    abstract displayMeasure(parameter: string, scope: paper.PaperScope): void;
    getPosition(scope: paper.PaperScope): number[] {
        if (this.parent) {
            const parentCords = this.parent.getPosition(scope);
            const width: number = Number(this.parameters["width"].getValue());
            const height: number = Number(this.parameters["height"].getValue());
            const [x, y] = getPosition(this.cords, width, height);
            return [parentCords[0] + x - width / 2, parentCords[1] + y - height / 2];
        }
        const width = scope.view.size.width;
        const height = scope.view.size.height;
        const [x, y] = getPosition(this.cords, width, height);
        return [x, y];
    }
    getParameters(): Record<string, Parameters> {
        return this.parameters;
    }
    destroy(): void {
        this.paths.forEach(path => path.destroy());
        this.paths = [];
        this.parent = null;
        this.path?.remove();
        this.path = null;
    }
}

export class WidthParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
        this.willChange = false;
    }

    min(): number {
        return 0;
    }

    max(): number {
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope?: paper.PaperScope): void {
        this.value = value;
        if (scope)
            this.path.update(scope);
    }
}

export class HeightParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
        this.willChange = false;
    }

    min(): number {
        return 0;
    }

    max(): number {
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope?: paper.PaperScope): void {
        this.value = value;
        if (scope)
            this.path.update(scope);
    }
}