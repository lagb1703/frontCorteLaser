import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "../paths/parameters";
import { CircumferencePath } from "./circumference";
import _ from "paper";

export class CirclesPath extends BasicPath {
    redShape: paper.Path | null = null;
    shapeText: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], radius: number, circleNumber: number, radiusGap: number, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["circlesNumber"] = new CircleNumberParameter(circleNumber, this);
        this.parameters["circlesRadius"] = new CirclesRadiusParameter(radius, this);
        this.parameters["circlesGap"] = new CirclesGapParameter(radiusGap, this);
        this.parameters["angleGap"] = new CirclesAngleGapParameter(0, this);
        this.parameters["width"].setValue(2 * (radius + radiusGap));
        this.parameters["height"].setValue(2 * (radius + radiusGap));
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const radiusGap = typeof this.parameters["circlesGap"].getValue() === "number" ? this.parameters["circlesGap"].getValue() as number : parseFloat(this.parameters["circlesGap"].getValue() as string);
        const radius = typeof this.parameters["circlesRadius"].getValue() === "number" ? this.parameters["circlesRadius"].getValue() as number : parseFloat(this.parameters["circlesRadius"].getValue() as string);
        const circlesNumber = typeof this.parameters["circlesNumber"].getValue() === "number" ? this.parameters["circlesNumber"].getValue() as number : parseFloat(this.parameters["circlesNumber"].getValue() as string);
        const angleGap = typeof this.parameters["angleGap"].getValue() === "number" ? this.parameters["angleGap"].getValue() as number : parseFloat(this.parameters["angleGap"].getValue() as string);
        const angleStep = 2 * Math.PI / circlesNumber;
        console.log(position)
        for (let i = 0; i < circlesNumber; i++) {
            const angle = i * angleStep + (angleGap * Math.PI / 180);
            const x = Math.cos(angle) * radiusGap;
            const y = Math.sin(angle) * radiusGap;
            const circlePath = new CircumferencePath(`${this.id}_circle_${i}`, [x + radius, y + radius], radius, this);
            circlePath.draw(scope);
            this.paths.push(circlePath);
        }
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const radiusGap = typeof this.parameters["circlesGap"].getValue() === "number" ? this.parameters["circlesGap"].getValue() as number : parseFloat(this.parameters["circlesGap"].getValue() as string);
        const radius = typeof this.parameters["circlesRadius"].getValue() === "number" ? this.parameters["circlesRadius"].getValue() as number : parseFloat(this.parameters["circlesRadius"].getValue() as string);
        const circlesNumber = typeof this.parameters["circlesNumber"].getValue() === "number" ? this.parameters["circlesNumber"].getValue() as number : parseFloat(this.parameters["circlesNumber"].getValue() as string);
        const angleGap = typeof this.parameters["angleGap"].getValue() === "number" ? this.parameters["angleGap"].getValue() as number : parseFloat(this.parameters["angleGap"].getValue() as string);
        const angleStep = 2 * Math.PI / circlesNumber;
        let i = 0;
        for (; i < circlesNumber; i++) {
            const angle = i * angleStep + (angleGap * Math.PI / 180);
            const x = Math.cos(angle) * radiusGap;
            const y = Math.sin(angle) * radiusGap;
            if (this.paths[i]) {
                this.paths[i].cords = [x + radius, y + radius];
                this.paths[i].parameters["radius"].setValue(radius, scope);
                this.paths[i].update(scope);
            } else {
                const circlePath = new CircumferencePath(`${this.id}_circle_${i}`, [x + radius, y + radius], radius, this);
                circlePath.draw(scope);
                this.paths.push(circlePath);
            }
        }
        while (this.paths.length > circlesNumber) {
            const pathToRemove = this.paths.pop();
            pathToRemove?.path?.remove();
        }
    }
    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        switch (parameter) {
            case "circlesRadius":
                this.paths.forEach((p) => {
                    if (p instanceof CircumferencePath) {
                        p.displayMeasure("radius", scope);
                    }
                });
                break;
            case "circlesGap":
                this.redShape?.remove();
                this.shapeText?.remove();
                const radiusGap = typeof this.parameters["circlesGap"].getValue() === "number" ? this.parameters["circlesGap"].getValue() as number : parseFloat(this.parameters["circlesGap"].getValue() as string);
                this.redShape = new scope.Path.Circle({
                    center: new scope.Point(position[0], position[1]),
                    radius: radiusGap,
                    strokeColor: 'red'
                });
                this.shapeText = new scope.PointText({
                    point: new scope.Point(position[0] + radiusGap + 10, position[1]),
                    content: `gap: ${radiusGap}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.timeoutId = window.setTimeout(() => {
                    this.redShape?.remove();
                    this.shapeText?.remove();
                }, 3000);
                break;
            default:
                return;
        }
    }
}

export class CircleNumberParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 2;
    }

    max(_?: paper.PaperScope): number {
        const circlesGapParameter = this.path.parameters["circlesGap"];
        const radiusParameter = this.path.parameters["circlesRadius"];
        let radius = 0;
        let radiusGap = 1;
        if (typeof radiusParameter.getValue() === "number") {
            radius = radiusParameter.getValue() as number;
        }
        if (typeof circlesGapParameter.getValue() === "number") {
            radiusGap = circlesGapParameter.getValue() as number;
        }
        return Math.floor(Math.PI / Math.asin(radius / radiusGap));
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

export class CirclesRadiusParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
        this.path.paths.forEach((p) => {
            if (p instanceof CircumferencePath) {
                p.parameters["radius"].setValue(value);
            }
        });
    }

    min(_?: paper.PaperScope): number {
        return 5;
    }

    max(_?: paper.PaperScope): number {
        const parentWidthParameter = this.path.parent?.parameters["width"];
        const parentHeightParameter = this.path.parent?.parameters["height"];
        let parentWidth = Infinity;
        let parentHeight = Infinity;
        if (parentWidthParameter) {
            if (typeof parentWidthParameter.getValue() === "number") {
                parentWidth = parentWidthParameter.getValue() as number;
            } else {
                parentWidth = parseFloat(parentWidthParameter.getValue() as string);
            }
        }
        if (parentHeightParameter) {
            if (typeof parentHeightParameter.getValue() === "number") {
                parentHeight = parentHeightParameter.getValue() as number;
            } else {
                parentHeight = parseFloat(parentHeightParameter.getValue() as string);
            }
        }
        const circlesNumberParameter = this.path.parameters["circlesNumber"];
        const circlesGapParameter = this.path.parameters["circlesGap"];
        let circlesNumber = 1;
        let radiusGap = 0;
        if (typeof circlesNumberParameter.getValue() === "number") {
            circlesNumber = circlesNumberParameter.getValue() as number;
        }
        if (typeof circlesGapParameter.getValue() === "number") {
            radiusGap = circlesGapParameter.getValue() as number;
        }
        return Math.min(Math.floor(radiusGap * Math.sin(Math.PI / circlesNumber)), Math.floor((parentWidth - 2 * radiusGap) / 2), Math.floor((parentHeight - 2 * radiusGap) / 2));
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        this.value = value;
        const circlesGapParameter = this.path.parameters["circlesGap"];
        let radiusGap = 0;
        if (typeof circlesGapParameter.getValue() === "number") {
            radiusGap = circlesGapParameter.getValue() as number;
        }
        this.path.parameters["width"].setValue(2 * (Number(this.value) + radiusGap));
        this.path.parameters["height"].setValue(2 * (Number(this.value) + radiusGap));
        this.path.paths.forEach((p) => {
            if (p instanceof CircumferencePath) {
                p.parameters["radius"].setValue(value, scope);
            }
        });
        if (scope) {
            this.path.update(scope);
        }
    }
}

export class CirclesGapParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        const radiusParameter = this.path.parameters["circlesRadius"];
        const circlesNumberParameter = this.path.parameters["circlesNumber"];
        let radius = 0;
        let circlesNumber = 1;
        if (typeof radiusParameter.getValue() === "number") {
            radius = radiusParameter.getValue() as number;
        }
        if (typeof circlesNumberParameter.getValue() === "number") {
            circlesNumber = circlesNumberParameter.getValue() as number;
        }
        return Math.ceil(radius / Math.sin(Math.PI / circlesNumber));
    }

    max(scope?: paper.PaperScope): number {
        if (!scope) {
            return Infinity;
        }
        const parentWidthParameter = this.path.parent?.parameters["width"];
        const parentHeightParameter = this.path.parent?.parameters["height"];
        let parentWidth = Infinity;
        let parentHeight = Infinity;
        if (parentWidthParameter) {
            if (typeof parentWidthParameter.getValue() === "number") {
                parentWidth = parentWidthParameter.getValue() as number;
            } else {
                parentWidth = parseFloat(parentWidthParameter.getValue() as string);
            }
        }
        if (parentHeightParameter) {
            if (typeof parentHeightParameter.getValue() === "number") {
                parentHeight = parentHeightParameter.getValue() as number;
            } else {
                parentHeight = parseFloat(parentHeightParameter.getValue() as string);
            }
        }
        const radiusParameter = this.path.parameters["circlesRadius"];
        let radius = 0;
        if (typeof radiusParameter.getValue() === "number") {
            radius = radiusParameter.getValue() as number;
        }
        console.log((parentHeight/2)-radius, (parentWidth/2)-radius)
        return Math.min((parentHeight/2)-radius, (parentWidth/2)-radius);
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        this.value = value;
        const radiusParameter = this.path.parameters["circlesRadius"];
        let radius = 0;
        if (typeof radiusParameter.getValue() === "number") {
            radius = radiusParameter.getValue() as number;
        }
        this.path.parameters["width"].setValue(2 * (radius + Number(value)));
        this.path.parameters["height"].setValue(2 * (radius + Number(value)));
        if (scope) {
            this.path.update(scope);
        }
    }
}

export class CirclesAngleGapParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 0;
    }

    max(_?: paper.PaperScope): number {
        return 360;
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