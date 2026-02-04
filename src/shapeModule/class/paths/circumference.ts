import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "../paths/parameters";
import _ from "paper";

export class CircumferencePath extends BasicPath {
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
        this.paths.forEach(path => path.update(scope));
    }
}

export class RadiusParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(): number | string {
        return 0;
    }

    max(): number | string {
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        console.log("Setting radius value to:", value);
        this.value = value;
        this.path.update(scope);
    }
}