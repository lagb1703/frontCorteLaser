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

    min(scope?: paper.PaperScope): number {
        if(!scope) return 0;
        let minX = Infinity;
        let maxX = -Infinity;
        this.path.paths.forEach(subPath => {
            const position = subPath.getPosition(scope);
            const width = Number(subPath.parameters["width"].getValue());
            if (position[0] - width < minX) minX = position[0] - width;
            if (position[0] + width > maxX) maxX = position[0] + width;
        });
        const center = this.path.getPosition(scope);
        const maxRadiusX = Math.min(center[0] - minX, maxX - center[0]);
        return maxRadiusX;
    }

    max(scope?: paper.PaperScope): number {
        if (!scope) return 100;
        let parentWidthParam = scope.view.size.width;
        let parentCords = [scope.view.size.width / 2, scope.view.size.height / 2];
        if (this.path.parent) {
            parentWidthParam = Number(this.path.parent.parameters["width"].getValue());
            parentCords = this.path.parent.getPosition(scope);
        }
        const leftLimit = parentCords[0] - parentWidthParam / 2;
        const rightLimit = parentCords[0] + parentWidthParam / 2;
        const [centerX, _] = this.path.getPosition(scope);
        const maxRadiusX = Math.min(centerX - leftLimit, rightLimit - centerX);
        return maxRadiusX;
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

    min(scope?: paper.PaperScope): number {
        if (!scope) return 0;
        let minY = Infinity;
        let maxY = -Infinity;
        this.path.paths.forEach(subPath => {
            const position = subPath.getPosition(scope);
            const height = Number(subPath.parameters["height"].getValue());
            if (position[1] - height < minY) minY = position[1] - height;
            if (position[1] + height > maxY) maxY = position[1] + height;
        });
        const center = this.path.getPosition(scope);
        const maxRadiusY = Math.min(center[1] - minY, maxY - center[1]);
        console.log("MinY:", minY, "MaxY:", maxY, "centerY:", center[1], "maxRadiusY:", maxRadiusY); // Debugging line
        return maxRadiusY
    }

    max(scope?: paper.PaperScope): number {
        if (!scope) return 100;
        let parentHeightParam = scope.view.size.height;
        let parentCords = [scope.view.size.width / 2, scope.view.size.height / 2];
        if (this.path.parent) {
            parentHeightParam = Number(this.path.parent.parameters["height"].getValue());
            parentCords = this.path.parent.getPosition(scope);
        }
        const topLimit = parentCords[1] - parentHeightParam / 2;
        const bottomLimit = parentCords[1] + parentHeightParam / 2;
        const [_, centerY] = this.path.getPosition(scope);
        const maxRadiusY = Math.min(centerY - topLimit, bottomLimit - centerY);
        return maxRadiusY;
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