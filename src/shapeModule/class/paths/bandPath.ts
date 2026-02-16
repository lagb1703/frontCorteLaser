import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "./parameters";
import { RadiusParameter } from "./circumference";
import _ from "paper";

export class BandPath extends BasicPath {
    redLine: paper.Path | null = null;
    radiusText: paper.PointText | null = null;
    timeoutId: number | null = null;
    curcumferences: paper.Path[] = [];
    constructor(
        id: string, 
        cords: (number | "start" | "center" | "end")[], 
        circumferencesGaps: number, circumferencesRadius: number, 
        leftHeadCircumference: number, 
        rightHeadCircumference: number,
        headGap: number,
        parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["leftCircumferencegap"] = new GapParameter(circumferencesGaps, this);
        this.parameters["rightCircumferencegap"] = new GapParameter(circumferencesGaps, this);
        this.parameters["headgap"] = new GapParameter(headGap, this);
        this.parameters["leftCircumferenceRadius"] = new RadiusParameter(circumferencesRadius, this);
        this.parameters["rightCircumferenceRadius"] = new RadiusParameter(circumferencesRadius, this);
        this.parameters["leftHeadCircumference"] = new RadiusParameter(leftHeadCircumference, this);
        this.parameters["rightHeadCircumference"] = new RadiusParameter(rightHeadCircumference, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const leftCircumferenceGap = Number(this.parameters["leftCircumferencegap"].getValue());
        const rightCircumferenceGap = Number(this.parameters["rightCircumferencegap"].getValue());
        const leftCircumferenceRadius = Number(this.parameters["leftCircumferenceRadius"].getValue());
        const rightCircumferenceRadius = Number(this.parameters["rightCircumferenceRadius"].getValue());
        const leftHeadCircumference = Number(this.parameters["leftHeadCircumference"].getValue());
        const rightHeadCircumference = Number(this.parameters["rightHeadCircumference"].getValue());
        const headGap = Number(this.parameters["headgap"].getValue());
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        p.moveTo(new scope.Point(position[0] - headGap/2, position[1] - leftHeadCircumference));
        p.lineTo(new scope.Point(position[0] + headGap/2, position[1] - rightHeadCircumference));
        p.arcTo(
            new scope.Point(
                position[0] + headGap/2 + rightHeadCircumference, 
                position[1] + rightHeadCircumference/2
            ), 
            new scope.Point(
                position[0] + headGap/2, 
                position[1] + rightHeadCircumference
            )
        );
        p.lineTo(new scope.Point(position[0] - headGap/2, position[1] + leftHeadCircumference));
        p.arcTo(
            new scope.Point(
                position[0] - headGap/2 - leftHeadCircumference, 
                position[1] + leftHeadCircumference/2
            ), 
            new scope.Point(
                position[0] - headGap/2, 
                position[1] - leftHeadCircumference
            )
        );
        p.closePath();
        this.path = p;
        const leftCircumference = new scope.Path.Circle({
            center: new scope.Point(
                position[0] - headGap/2 - leftHeadCircumference/2 + leftCircumferenceRadius + leftCircumferenceGap, 
                position[1]
            ),
            radius: leftCircumferenceRadius,
            strokeColor: 'black'
        });
        const rightCircumference = new scope.Path.Circle({
            center: new scope.Point(
                position[0] + headGap/2 + rightHeadCircumference/2 - rightCircumferenceRadius - rightCircumferenceGap, 
                position[1]
            ),
            radius: rightCircumferenceRadius,
            strokeColor: 'black'
        });
        this.curcumferences.push(leftCircumference, rightCircumference);
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        this.curcumferences.forEach(c => c.remove());
        this.curcumferences = [];
        const position = this.getPosition(scope);
        const leftCircumferenceGap = Number(this.parameters["leftCircumferencegap"].getValue());
        const rightCircumferenceGap = Number(this.parameters["rightCircumferencegap"].getValue());
        const leftCircumferenceRadius = Number(this.parameters["leftCircumferenceRadius"].getValue());
        const rightCircumferenceRadius = Number(this.parameters["rightCircumferenceRadius"].getValue());
        const leftHeadCircumference = Number(this.parameters["leftHeadCircumference"].getValue());
        const rightHeadCircumference = Number(this.parameters["rightHeadCircumference"].getValue());
        const headGap = Number(this.parameters["headgap"].getValue());
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        p.moveTo(new scope.Point(position[0] - headGap/2, position[1] - leftHeadCircumference));
        p.lineTo(new scope.Point(position[0] + headGap/2, position[1] - rightHeadCircumference));
        p.arcTo(
            new scope.Point(
                position[0] + headGap/2 + rightHeadCircumference, 
                position[1] + rightHeadCircumference/2
            ), 
            new scope.Point(
                position[0] + headGap/2, 
                position[1] + rightHeadCircumference
            )
        );
        p.lineTo(new scope.Point(position[0] - headGap/2, position[1] + leftHeadCircumference));
        p.arcTo(
            new scope.Point(
                position[0] - headGap/2 - leftHeadCircumference, 
                position[1] + leftHeadCircumference/2
            ), 
            new scope.Point(
                position[0] - headGap/2, 
                position[1] - leftHeadCircumference
            )
        );
        p.closePath();
        this.path = p;
        const leftCircumference = new scope.Path.Circle({
            center: new scope.Point(
                position[0] - headGap/2 - leftHeadCircumference/2 + leftCircumferenceRadius + leftCircumferenceGap, 
                position[1]
            ),
            radius: leftCircumferenceRadius,
            strokeColor: 'black'
        });
        const rightCircumference = new scope.Path.Circle({
            center: new scope.Point(
                position[0] + headGap/2 + rightHeadCircumference/2 - rightCircumferenceRadius - rightCircumferenceGap, 
                position[1]
            ),
            radius: rightCircumferenceRadius,
            strokeColor: 'black'
        });
        this.curcumferences.push(leftCircumference, rightCircumference);
    }
    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        switch (parameter) {
            case "radius":
                const radiusParam = this.parameters["radius"];
                const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
                this.redLine?.remove();
                this.radiusText?.remove();
                this.redLine = new scope.Path.Line({
                    from: new scope.Point(position[0], position[1]),
                    to: new scope.Point(position[0] + radius, position[1]),
                    strokeColor: 'red'
                });
                this.radiusText = new scope.PointText({
                    point: new scope.Point(position[0] + (radius / 30) ** 2, position[1] - 10),
                    content: `r: ${radius}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.timeoutId = window.setTimeout(() => {
                    this.redLine?.remove();
                    this.radiusText?.remove();
                }, 1000);
                break;
            default:
                return;
        }
    }
}

export class GapParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
        const widthParameter = this.path.parameters["width"];
        const heightParameter = this.path.parameters["height"];
        if (widthParameter) {
            widthParameter.setValue(2 * Number(value));
        }
        if (heightParameter) {
            heightParameter.setValue(2 * Number(value));
        }
    }

    min(scope?: paper.PaperScope): number {
        return 0;
    }

    max(scope?: paper.PaperScope): number {
        return Infinity;
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