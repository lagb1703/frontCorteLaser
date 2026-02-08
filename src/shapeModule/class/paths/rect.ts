import type { Path } from "@/shapeModule/interfaces";
import { Parameters } from "./parameters";
import { BasicPath } from "./basicPath";
import _ from "paper";

export class RectPath extends BasicPath {
    line: paper.Path | null = null;
    text: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], width: number, height: number, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["width"].setValue(width);
        this.parameters["width"].willChange = true;
        this.parameters["height"].setValue(height);
        this.parameters["height"].willChange = true;
        this.parameters["border"] = new BorderRect(1, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const borderParam = this.parameters["border"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const border = typeof borderParam.getValue() === "number" ? borderParam.getValue() as number : parseFloat(borderParam.getValue() as string);
        this.path = new scope.Path.Rectangle({
            point: new scope.Point(position[0] - width / 2, position[1] - height / 2),
            size: new scope.Size(width, height),
            radius: border,
            strokeColor: 'black'
        });
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const borderParam = this.parameters["border"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const border = typeof borderParam.getValue() === "number" ? borderParam.getValue() as number : parseFloat(borderParam.getValue() as string);
        this.path = new scope.Path.Rectangle({
            point: new scope.Point(position[0] - width / 2, position[1] - height / 2),
            size: new scope.Size(width, height),
            radius: border,
            strokeColor: 'black',
            strokeJoin: 'round'
        });
    }

    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const borderParam = this.parameters["border"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const border = typeof borderParam.getValue() === "number" ? borderParam.getValue() as number : parseFloat(borderParam.getValue() as string);
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
            case "border":
                this.line?.remove();
                this.text?.remove();
                this.line = new scope.Path.Arc({
                    from: new scope.Point(position[0] - width / 2, position[1] - height / 2 + border),
                    through: new scope.Point(position[0] - width / 2 + border / 2, position[1] - height / 2 + border / 2),
                    to: new scope.Point(position[0] - width / 2 + border, position[1] - height / 2),
                    strokeColor: 'red'
                });
                this.text = new scope.PointText({
                    point: new scope.Point(position[0] - width / 2 + border / 2, position[1] - height / 2 - 10),
                    content: `r: ${border}`,
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

class BorderRect extends Parameters {
    willChange = true;

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 0;
    }

    max(_?: paper.PaperScope): number {
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