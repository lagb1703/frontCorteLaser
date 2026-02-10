import type { Path } from "@/shapeModule/interfaces";
import { Parameters } from "./parameters";
import { BasicPath } from "./basicPath";
import paper from "paper";

export class RectPath extends BasicPath {
    line: paper.Path | null = null;
    text: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], width: number, height: number, borderRadius?: number | null, parent: BasicPath | null = null) {
        super(id, parent);
        this.cords = cords;
        this.parameters["width"].setValue(width);
        this.parameters["width"].willChange = true;
        this.parameters["height"].setValue(height);
        this.parameters["height"].willChange = true;
        this.parameters["borders"] = new BordersRect(borderRadius ?? 0, this);
        this.parameters["borderTopLeft"] = new BorderRect(borderRadius ?? 0, this);
        this.parameters["borderTopRight"] = new BorderRect(borderRadius ?? 0, this);
        this.parameters["borderBottomLeft"] = new BorderRect(borderRadius ?? 0, this);
        this.parameters["borderBottomRight"] = new BorderRect(borderRadius ?? 0, this);
    }
    draw(scope: paper.PaperScope): void {
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const borderParam = this.parameters["borders"];
        const border = typeof borderParam.getValue() === "number" ? borderParam.getValue() as number : parseFloat(borderParam.getValue() as string);
        const p = new scope.Path({ strokeColor: 'black', closed: true })
        p.moveTo(new scope.Point(position[0] - width / 2 + border, position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2 - border, position[1] - height / 2));
        p.arcTo(
            new paper.Point(
                position[0] + (width / 2) + border*Math.cos(Math.PI/4) - border, 
                position[1] - (height / 2) - border*Math.sin(Math.PI/4) + border
            ),
            new paper.Point(position[0] + width / 2, position[1] - height / 2 + border)
        )
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2 - border));
        p.arcTo(
            new paper.Point(
                position[0] + (width / 2) + border*Math.cos(Math.PI/4) - border, 
                position[1] + (height / 2) + border*Math.sin(Math.PI/4) - border
            ),
            new paper.Point(position[0] + width / 2 - border, position[1] + height / 2)
        )
        p.lineTo(new scope.Point(position[0] - width / 2 + border, position[1] + height / 2));
        p.arcTo(
            new paper.Point(
                position[0] - (width / 2) - border*Math.cos(Math.PI/4) + border, 
                position[1] + (height / 2) + border*Math.sin(Math.PI/4) - border
            ),
            new paper.Point(position[0] - width / 2, position[1] + height / 2 - border)
        )
        p.lineTo(new scope.Point(position[0] - width / 2, position[1] - height / 2 + border));
        p.arcTo(
            new paper.Point(
                position[0] - (width / 2) - border*Math.cos(Math.PI/4) + border, 
                position[1] - (height / 2) - border*Math.sin(Math.PI/4) + border
            ),
            new paper.Point(position[0] - width / 2 + border, position[1] - height / 2)
        )
        this.path = p;
    }
    update(scope: paper.PaperScope): void {
        this.path?.remove();
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
        const borderTopLeftParam = this.parameters["borderTopLeft"];
        const borderTopRightParam = this.parameters["borderTopRight"];
        const borderBottomLeftParam = this.parameters["borderBottomLeft"];
        const borderBottomRightParam = this.parameters["borderBottomRight"];
        const borderTopLeft = typeof borderTopLeftParam.getValue() === "number" ? borderTopLeftParam.getValue() as number : parseFloat(borderTopLeftParam.getValue() as string);
        const borderTopRight = typeof borderTopRightParam.getValue() === "number" ? borderTopRightParam.getValue() as number : parseFloat(borderTopRightParam.getValue() as string);
        const borderBottomLeft = typeof borderBottomLeftParam.getValue() === "number" ? borderBottomLeftParam.getValue() as number : parseFloat(borderBottomLeftParam.getValue() as string);
        const borderBottomRight = typeof borderBottomRightParam.getValue() === "number" ? borderBottomRightParam.getValue() as number : parseFloat(borderBottomRightParam.getValue() as string);
        const p = new scope.Path({ strokeColor: 'black', closed: true })
        p.moveTo(new scope.Point(position[0] - width / 2 + borderTopLeft, position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2 - borderTopRight, position[1] - height / 2));
        p.arcTo(
            new paper.Point(
                position[0] + (width / 2) + borderTopRight*Math.cos(Math.PI/4) - borderTopRight, 
                position[1] - (height / 2) - borderTopRight*Math.sin(Math.PI/4) + borderTopRight
            ),
            new paper.Point(position[0] + width / 2, position[1] - height / 2 + borderTopRight)
        )
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2 - borderBottomRight));
        p.arcTo(
            new paper.Point(
                position[0] + (width / 2) + borderBottomRight*Math.cos(Math.PI/4) - borderBottomRight, 
                position[1] + (height / 2) + borderBottomRight*Math.sin(Math.PI/4) - borderBottomRight
            ),
            new paper.Point(position[0] + width / 2 - borderBottomRight, position[1] + height / 2)
        )
        p.lineTo(new scope.Point(position[0] - width / 2 + borderBottomLeft, position[1] + height / 2));
        p.arcTo(
            new paper.Point(
                position[0] - (width / 2) - borderBottomLeft*Math.cos(Math.PI/4) + borderBottomLeft, 
                position[1] + (height / 2) + borderBottomLeft*Math.sin(Math.PI/4) - borderBottomLeft
            ),
            new paper.Point(position[0] - width / 2, position[1] + height / 2 - borderBottomLeft)
        )
        p.lineTo(new scope.Point(position[0] - width / 2, position[1] - height / 2 + borderTopLeft));
        p.arcTo(
            new paper.Point(
                position[0] - (width / 2) - borderTopLeft*Math.cos(Math.PI/4) + borderTopLeft, 
                position[1] - (height / 2) - borderTopLeft*Math.sin(Math.PI/4) + borderTopLeft
            ),
            new paper.Point(position[0] - width / 2 + borderTopLeft, position[1] - height / 2)
        )
        this.path = p;
    }

    displayMeasure(parameter: string, scope: paper.PaperScope): void {
        this.selectParameter = parameter;
        const position = this.getPosition(scope);
        const widthParam = this.parameters["width"];
        const heightParam = this.parameters["height"];
        const width = typeof widthParam.getValue() === "number" ? widthParam.getValue() as number : parseFloat(widthParam.getValue() as string);
        const height = typeof heightParam.getValue() === "number" ? heightParam.getValue() as number : parseFloat(heightParam.getValue() as string);
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

class BordersRect extends Parameters {
    willChange = true;

    constructor(value: number | string, path: Path) {
        super(value, path);
    }

    min(_?: paper.PaperScope): number {
        return 0;
    }

    max(_?: paper.PaperScope): number {
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        if (typeof height.getValue() === "number" && typeof width.getValue() === "number") {
            return Math.min(height.getValue() as number, width.getValue() as number) / 2;
        }
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        this.value = value;
        this.path.parameters["borderTopLeft"].setValue(value, scope);
        this.path.parameters["borderTopRight"].setValue(value, scope);
        this.path.parameters["borderBottomLeft"].setValue(value, scope);
        this.path.parameters["borderBottomRight"].setValue(value, scope);
        if (scope) {
            this.path.update(scope);
        }
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
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        if (typeof height.getValue() === "number" && typeof width.getValue() === "number") {
            return Math.min(height.getValue() as number, width.getValue() as number) / 2;
        }
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        super.setValue(value, scope);
    }
}