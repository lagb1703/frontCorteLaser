import type { Path } from "@/shapeModule/interfaces";
import { BasicPath } from "./basicPath";
import { Parameters } from "../paths/parameters";
import _ from "paper";

export class TrianglePath extends BasicPath {
    line: paper.Path | null = null;
    text: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], width: number, height: number, offset: number, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["width"].setValue(width);
        this.parameters["width"].willChange = true;
        this.parameters["height"].setValue(height);
        this.parameters["height"].willChange = true;
        this.parameters["offset"] = new OffsetParameter(offset, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const offsetParam = this.parameters["offset"];
        const offset = typeof offsetParam.getValue() === "number" ? offsetParam.getValue() as number : parseFloat(offsetParam.getValue() as string);
        const width: number = Number(this.parameters["width"].getValue());
        const height: number = Number(this.parameters["height"].getValue());
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        p.moveTo(new scope.Point(position[0] - width / 2 + offset, position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] - width / 2 + offset, position[1] + height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2));
        this.path = p;
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const position = this.getPosition(scope);
        const offsetParam = this.parameters["offset"];
        const offset = typeof offsetParam.getValue() === "number" ? offsetParam.getValue() as number : parseFloat(offsetParam.getValue() as string);
        const width: number = Number(this.parameters["width"].getValue());
        const height: number = Number(this.parameters["height"].getValue());
        const p = new scope.Path({ strokeColor: 'black', closed: true });
        p.moveTo(new scope.Point(position[0] - width / 2 + offset, position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] - width / 2, position[1] + height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2));
        this.path = p;
    }
    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const offsetParam = this.parameters["offset"];
        const offset = typeof offsetParam.getValue() === "number" ? offsetParam.getValue() as number : parseFloat(offsetParam.getValue() as string);
        switch (parameter) {
            case "width":
                this.line?.remove();
                this.text?.remove();
                this.line = new scope.Path.Line({
                    from: new scope.Point(position[0] - width / 2, position[1] + height / 2 + 10),
                    to: new scope.Point(position[0] + width / 2, position[1] + height / 2 + 10),
                    strokeColor: 'red'
                });
                this.text = new scope.PointText({
                    point: new scope.Point(position[0], position[1] + height / 2 + 25),
                    content: `w: ${width}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                break;
            case "height":
                this.line?.remove();
                this.text?.remove();
                this.line = new scope.Path.Line({
                    from: new scope.Point(position[0] + width / 2 + 10, position[1] - height / 2),
                    to: new scope.Point(position[0] + width / 2 + 10, position[1] + height / 2),
                    strokeColor: 'red'
                });
                this.text = new scope.PointText({
                    point: new scope.Point(position[0] + width / 2 + 25, position[1]),
                    content: `h: ${height}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                break;
            case "offset":
                this.line?.remove();
                this.text?.remove();
                this.line = new scope.Path.Line({
                    from: new scope.Point(position[0] - width / 2, position[1] + height / 2 + 10),
                    to: new scope.Point(position[0] - (width / 2) + offset, position[1] + height / 2 + 10),
                    strokeColor: 'red'
                });
                this.text = new scope.PointText({
                    point: new scope.Point(position[0] - (width / 2) + offset, position[1] + height / 2 + 25),
                    content: `offset: ${offset}`,
                    fillColor: 'red',
                    fontSize: 20
                });
                break;
            default:
                return;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(() => {
            this.line?.remove();
            this.text?.remove();
        }, 1000);
    }
}

export class OffsetParameter extends Parameters {

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 0;
    }

    max(_?: paper.PaperScope): number {
        const widthParameter = this.path.parameters["width"];
        let w = 0;
        if (widthParameter) {
            w = widthParameter.getValue() as number;
        }
        return w;
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