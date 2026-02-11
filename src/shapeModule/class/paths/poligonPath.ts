import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "../paths/parameters";
import { RadiusParameter } from "./circumference";
import _ from "paper";

export class PoligonPath extends BasicPath {
    line: paper.Path | null = null;
    circle: paper.Path | null = null;
    text: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], radius: number, sides: number, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["radius"] = new RadiusParameter(radius, this);
        this.parameters["sides"] = new SideParameter(sides, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const radiusParam = this.parameters["radius"];
        const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
        const sidesParam = this.parameters["sides"];
        const sides = typeof sidesParam.getValue() === "number" ? sidesParam.getValue() as number : parseFloat(sidesParam.getValue() as string);
        const angle = (2 * Math.PI) / sides;
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        p.moveTo(new scope.Point(position[0] + radius, position[1]));
        for (let i = 0; i < sides; i++) {
            const x = position[0] + radius * Math.cos(i * angle - Math.PI / 2);
            const y = position[1] + radius * Math.sin(i * angle - Math.PI / 2);
            if (i == 0) {
                p.moveTo(new scope.Point(x, y));
                continue;
            }
            p.lineTo(new scope.Point(x, y));
        }
        this.path = p;
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const position = this.getPosition(scope);
        const radiusParam = this.parameters["radius"];
        const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
        const sidesParam = this.parameters["sides"];
        const sides = typeof sidesParam.getValue() === "number" ? sidesParam.getValue() as number : parseFloat(sidesParam.getValue() as string);
        const angle = (2 * Math.PI) / sides;
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        for (let i = 0; i < sides; i++) {
            const x = position[0] + radius * Math.cos(i * angle - Math.PI / 2);
            const y = position[1] + radius * Math.sin(i * angle - Math.PI / 2);
            if (i == 0) {
                p.moveTo(new scope.Point(x, y));
                continue;
            }
            p.lineTo(new scope.Point(x, y));
        }
        this.path = p;
    }
    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        switch (parameter) {
            case "radius":
                const radiusParam = this.parameters["radius"];
                const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
                this.line?.remove();
                this.text?.remove();
                this.circle?.remove();
                this.circle = new scope.Path.Circle({
                    center: new scope.Point(position[0], position[1]),
                    radius: radius,
                    strokeColor: 'red',
                });
                this.line = new scope.Path.Line({
                    from: new scope.Point(position[0], position[1]),
                    to: new scope.Point(position[0] + radius, position[1]),
                    strokeColor: 'red'
                });
                this.text = new scope.PointText({
                    point: new scope.Point(position[0] + (radius / 30) ** 2, position[1] - 10),
                    content: `r: ${radius}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.timeoutId = window.setTimeout(() => {
                    this.line?.remove();
                    this.text?.remove();
                    this.circle?.remove();
                }, 1000);
                break;
            default:
                return;
        }
    }
}

export class SideParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 3;
    }

    max(_?: paper.PaperScope): number {
        return 10;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        this.value = value;
        if (scope) {
            this.path.update(scope);
        }
    }
}