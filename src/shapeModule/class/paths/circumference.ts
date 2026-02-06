import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "../paths/parameters";
import _ from "paper";

export class CircumferencePath extends BasicPath {
    redLine: paper.Path | null = null;
    radiusText: paper.PointText | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], radius: number, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["radius"] = new RadiusParameter(radius, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        console.log("Drawing CircumferencePath at position:", position);
        const radiusParam = this.parameters["radius"];
        const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
        this.path = new scope.Path.Circle({
            center: new scope.Point(position[0], position[1]),
            radius: radius,
            strokeColor: 'black'
        });
        this.paths.forEach(path => path.draw(scope));
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const position = this.getPosition(scope);
        const radiusParam = this.parameters["radius"];
        const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
        this.path = new scope.Path.Circle({
            center: new scope.Point(position[0], position[1]),
            radius: radius,
            strokeColor: 'black'
        });
        this.redLine?.remove();
        this.radiusText?.remove();
        this.redLine = new scope.Path.Line({
            from: new scope.Point(position[0], position[1]),
            to: new scope.Point(position[0] + radius, position[1]),
            strokeColor: 'red'
        });
        this.radiusText = new scope.PointText({
            point: new scope.Point(position[0] + (radius / 30)**2, position[1] - 10),
            content: `r: ${radius}`,
            fillColor: 'red',
            fontSize: 20
        });
        this.paths.forEach(path => path.update(scope));
    }
}

export class RadiusParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 1;
    }

    max(scope?: paper.PaperScope): number {
        if (!scope) return 100;
        let parentWidthParam = scope.view.size.width;
        let parentHeightParam = scope.view.size.height;
        let parentCords = [scope.view.size.width / 2, scope.view.size.height / 2];
        if (this.path.parent) {
            parentWidthParam = Number(this.path.parent.parameters["width"].getValue());
            parentHeightParam = Number(this.path.parent.parameters["height"].getValue());
            parentCords = this.path.parent.getPosition(scope);
        }
        const leftLimit = parentCords[0] - parentWidthParam / 2;
        const rightLimit = parentCords[0] + parentWidthParam / 2;
        const topLimit = parentCords[1] - parentHeightParam / 2;
        const bottomLimit = parentCords[1] + parentHeightParam / 2;
        const [centerX, centerY] = this.path.getPosition(scope);
        const maxRadiusX = Math.min(centerX - leftLimit, rightLimit - centerX);
        const maxRadiusY = Math.min(centerY - topLimit, bottomLimit - centerY);
        return Math.min(maxRadiusX, maxRadiusY);
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        console.log("Setting radius value to:", value);
        const widthParameter = this.path.parameters["width"];
        const heightParameter = this.path.parameters["height"];
        if (widthParameter) {
            widthParameter.setValue(2 * Number(value));
        }
        if (heightParameter) {
            heightParameter.setValue(2 * Number(value));
        }
        this.value = value;
        if (scope) {
            this.path.update(scope);
        }
    }
}