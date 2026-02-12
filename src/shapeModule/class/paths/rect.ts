import type { Path } from "@/shapeModule/interfaces";
import { Parameters } from "./parameters";
import { BasicPath } from "./basicPath";
import paper from "paper";

type BorderType = "rounded" | "plain" | "rect";

export class RectPath extends BasicPath {
    line: paper.Path | null = null;
    text: paper.PointText | null = null;
    timeoutId: number | null = null;
    constructor(id: string, cords: (number | "start" | "center" | "end")[], width: number, height: number, borderRadius?: number | null, borderType: BorderType = "rounded", parent: BasicPath | null = null) {
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
        this.parameters["borderType"] = new BorderTypeRect(borderType, this);
    }
    draw(scope: paper.PaperScope): void {
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
        const borderTypeParam = this.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as BorderType;
        const borderTopLeft = borderTopLeftParam.getValue() as number;
        const borderTopRight = borderTopRightParam.getValue() as number;
        const borderBottomLeft = borderBottomLeftParam.getValue() as number;
        const borderBottomRight = borderBottomRightParam.getValue() as number;
        const angle = (sign: number, borderType: BorderType) => {
            if (borderType === "plain")
                return Math.PI / 2;
            if (sign > 0)
                return Math.PI / 4;
            return 5 * Math.PI / 4;
        };
        const offset = (sign: number) => (sign > 0) ? Math.abs(sign) : 0;
        const p = new scope.Path({ strokeColor: 'black', closed: true })
        p.moveTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderTopRight), position[1] - height / 2));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderTopRight), position[1] - height / 2 + Math.abs(borderTopRight)));
            p.lineTo(new scope.Point(position[0] + width / 2, position[1] - height / 2 + Math.abs(borderTopRight)));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] + (width / 2) + Math.abs(borderTopRight) * Math.cos(angle(borderTopRight, borderType)) - offset(borderTopRight),
                    position[1] - (height / 2) - Math.abs(borderTopRight) * Math.sin(angle(borderTopRight, borderType)) + offset(borderTopRight)
                ),
                new paper.Point(position[0] + width / 2, position[1] - height / 2 + Math.abs(borderTopRight))
            )
        }
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2 - Math.abs(borderBottomRight)));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2 - Math.abs(borderBottomRight)));
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] + (width / 2) + Math.abs(borderBottomRight) * Math.cos(angle(borderBottomRight, borderType)) - offset(borderBottomRight),
                    position[1] + (height / 2) + Math.abs(borderBottomRight) * Math.sin(angle(borderBottomRight, borderType)) - offset(borderBottomRight)
                ),
                new paper.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2)
            )
        }
        p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderBottomLeft), position[1] + height / 2));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderBottomLeft), position[1] + height / 2 - Math.abs(borderBottomLeft)));
            p.lineTo(new scope.Point(position[0] - width / 2, position[1] + height / 2 - Math.abs(borderBottomLeft)));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] - (width / 2) - Math.abs(borderBottomLeft) * Math.cos(angle(borderBottomLeft, borderType)) + offset(borderBottomLeft),
                    position[1] + (height / 2) + Math.abs(borderBottomLeft) * Math.sin(angle(borderBottomLeft, borderType)) - offset(borderBottomLeft)
                ),
                new paper.Point(position[0] - width / 2, position[1] + height / 2 - Math.abs(borderBottomLeft))
            )
        }
        p.lineTo(new scope.Point(position[0] - width / 2, position[1] - height / 2 + Math.abs(borderTopLeft)));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2 + Math.abs(borderTopLeft)));
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] - (width / 2) - Math.abs(borderTopLeft) * Math.cos(angle(borderTopLeft, borderType)) + offset(borderTopLeft),
                    position[1] - (height / 2) - Math.abs(borderTopLeft) * Math.sin(angle(borderTopLeft, borderType)) + offset(borderTopLeft)
                ),
                new paper.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2)
            )
        }
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
        const borderTypeParam = this.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as BorderType;
        const borderTopLeft = borderTopLeftParam.getValue() as number;
        const borderTopRight = borderTopRightParam.getValue() as number;
        const borderBottomLeft = borderBottomLeftParam.getValue() as number;
        const borderBottomRight = borderBottomRightParam.getValue() as number;
        const angle = (sign: number, borderType: BorderType) => {
            if (borderType === "plain")
                return Math.PI / 2;
            if (sign > 0)
                return Math.PI / 4;
            return 5 * Math.PI / 4;
        };
        const offset = (sign: number) => (sign > 0) ? Math.abs(sign) : 0;
        const p = new scope.Path({ strokeColor: 'black', closed: true })
        p.moveTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2));
        p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderTopRight), position[1] - height / 2));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderTopRight), position[1] - height / 2 + Math.abs(borderTopRight)));
            p.lineTo(new scope.Point(position[0] + width / 2, position[1] - height / 2 + Math.abs(borderTopRight)));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] + (width / 2) + Math.abs(borderTopRight) * Math.cos(angle(borderTopRight, borderType)) - offset(borderTopRight),
                    position[1] - (height / 2) - Math.abs(borderTopRight) * Math.sin(angle(borderTopRight, borderType)) + offset(borderTopRight)
                ),
                new paper.Point(position[0] + width / 2, position[1] - height / 2 + Math.abs(borderTopRight))
            )
        }
        p.lineTo(new scope.Point(position[0] + width / 2, position[1] + height / 2 - Math.abs(borderBottomRight)));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2 - Math.abs(borderBottomRight)));
            p.lineTo(new scope.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] + (width / 2) + Math.abs(borderBottomRight) * Math.cos(angle(borderBottomRight, borderType)) - offset(borderBottomRight),
                    position[1] + (height / 2) + Math.abs(borderBottomRight) * Math.sin(angle(borderBottomRight, borderType)) - offset(borderBottomRight)
                ),
                new paper.Point(position[0] + width / 2 - Math.abs(borderBottomRight), position[1] + height / 2)
            )
        }
        p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderBottomLeft), position[1] + height / 2));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderBottomLeft), position[1] + height / 2 - Math.abs(borderBottomLeft)));
            p.lineTo(new scope.Point(position[0] - width / 2, position[1] + height / 2 - Math.abs(borderBottomLeft)));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] - (width / 2) - Math.abs(borderBottomLeft) * Math.cos(angle(borderBottomLeft, borderType)) + offset(borderBottomLeft),
                    position[1] + (height / 2) + Math.abs(borderBottomLeft) * Math.sin(angle(borderBottomLeft, borderType)) - offset(borderBottomLeft)
                ),
                new paper.Point(position[0] - width / 2, position[1] + height / 2 - Math.abs(borderBottomLeft))
            )
        }
        p.lineTo(new scope.Point(position[0] - width / 2, position[1] - height / 2 + Math.abs(borderTopLeft)));
        if (borderType === "rect") {
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2 + Math.abs(borderTopLeft)));
            p.lineTo(new scope.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2));
        } else {
            p.arcTo(
                new paper.Point(
                    position[0] - (width / 2) - Math.abs(borderTopLeft) * Math.cos(angle(borderTopLeft, borderType)) + offset(borderTopLeft),
                    position[1] - (height / 2) - Math.abs(borderTopLeft) * Math.sin(angle(borderTopLeft, borderType)) + offset(borderTopLeft)
                ),
                new paper.Point(position[0] - width / 2 + Math.abs(borderTopLeft), position[1] - height / 2)
            )
        }
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

    min(scope?: paper.PaperScope): number {
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        const maxRadiusX = this.path.parameters["borderTopLeft"].max(scope);
        const maxRadiusY = this.path.parameters["borderTopLeft"].max(scope);
        const borderTypeParam = this.path.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as "rounded" | "plain" | "rect";
        if (Number(width.getValue()) + 2 * Number(this.value) > maxRadiusX || Number(height.getValue()) + 2 * Number(this.value) > maxRadiusY) {
            return 0;
        }
        if (borderType === "plain" || borderType === "rect")
            return 0;
        if (typeof height.getValue() === "number" && typeof width.getValue() === "number") {
            return Math.max(-height.getValue() as number, -width.getValue() as number) / 4;
        }
        return 0;
    }

    max(scope?: paper.PaperScope): number {
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        const borderTypeParam = this.path.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as BorderType;
        const center = this.path.getPosition(scope!);
        let minY = Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        let maxX = -Infinity;
        this.path.paths.forEach(subPath => {
            const position = subPath.getPosition(scope!);
            const height = Number(subPath.parameters["height"].getValue());
            const width = Number(subPath.parameters["width"].getValue());
            if (position[1] - height / 2 < minY) minY = position[1] - height / 2;
            if (position[1] + height / 2 > maxY) maxY = position[1] + height / 2;
            if (position[0] - width / 2 < minX) minX = position[0] - width / 2;
            if (position[0] + width / 2 > maxX) maxX = position[0] + width / 2;
        });
        const maxBorder = Math.abs(
            Math.min(
                center[1] + (height.getValue() as number) / 2 - minY,
                maxY - center[1] - (height.getValue() as number) / 2,
                center[0] + (width.getValue() as number) / 2 - minX,
                maxX - center[0] - (width.getValue() as number) / 2
            )
        );
        if (maxBorder === Infinity) {
            if (borderType === "rounded")
                return Math.min(height.getValue() as number, width.getValue() as number) / 2;
            return Math.min(height.getValue() as number, width.getValue() as number) / 4;
        }
        return maxBorder;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        super.setValue(value, scope);
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
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        const borderTypeParam = this.path.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as BorderType;
        if (borderType === "plain" || borderType === "rect")
            return 0;
        if (typeof height.getValue() === "number" && typeof width.getValue() === "number") {
            return Math.max(-height.getValue() as number, -width.getValue() as number) / 4;
        }
        return 0;
    }

    max(scope?: paper.PaperScope): number {
        const height = this.path.parameters["height"];
        const width = this.path.parameters["width"];
        const borderTypeParam = this.path.parameters["borderType"];
        const borderType = borderTypeParam.getValue() as "rounded" | "plain" | "rect";
        const center = this.path.getPosition(scope!);
        let minY = Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        let maxX = -Infinity;
        this.path.paths.forEach(subPath => {
            const position = subPath.getPosition(scope!);
            const height = Number(subPath.parameters["height"].getValue());
            const width = Number(subPath.parameters["width"].getValue());
            if (position[1] - height / 2 < minY) minY = position[1] - height / 2;
            if (position[1] + height / 2 > maxY) maxY = position[1] + height / 2;
            if (position[0] - width / 2 < minX) minX = position[0] - width / 2;
            if (position[0] + width / 2 > maxX) maxX = position[0] + width / 2;
        });
        const maxBorder = Math.abs(
            Math.min(
                center[1] + (height.getValue() as number) / 2 - minY,
                maxY - center[1] - (height.getValue() as number) / 2,
                center[0] + (width.getValue() as number) / 2 - minX,
                maxX - center[0] - (width.getValue() as number) / 2
            )
        );
        if (maxBorder === Infinity) {
            if (borderType === "rounded")
                return Math.min(height.getValue() as number, width.getValue() as number) / 2;
            return Math.min(height.getValue() as number, width.getValue() as number) / 4;
        }
        return maxBorder;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string, scope: paper.PaperScope): void {
        super.setValue(value, scope);
    }
}

class BorderTypeRect extends Parameters {
    willChange = true;

    options?: string[] = ["rounded", "plain", "rect"];

    constructor(value: BorderType, path: Path) {
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

    setValue(value: "rounded" | "plain" | "rect", scope: paper.PaperScope): void {
        super.setValue(value, scope);
        const borders = [
            this.path.parameters["borders"],
            this.path.parameters["borderTopLeft"],
            this.path.parameters["borderTopRight"],
            this.path.parameters["borderBottomLeft"],
            this.path.parameters["borderBottomRight"]
        ]
        borders.forEach(border => {
            const value = border.getValue();
            if (Number(value) < 0) {
                border.setValue(0, scope);
            }
        });
    }
}