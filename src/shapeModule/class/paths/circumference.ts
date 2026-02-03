import type { Path, Parameters } from "../../interfaces"

export class CircumferencePath implements Path {
    id: string;
    parameters: Record<string, Parameters>;
    paths: Path[];
    cords: number[];
    isRelative: boolean;
    parent: Path | null;
    constructor(id: string, radius: number, isRelative: boolean = false, parent: Path | null = null) {
        this.id = id;
        this.parameters = {
            radius: new RadiusParameter(radius)
        };
        this.paths = [];
        this.cords = [0, 0];
        this.isRelative = isRelative;
        this.parent = parent;
    }
    draw(scope: paper.PaperScope): void {
        const centerX = this.cords[0];
        const centerY = this.cords[1];
        const radiusParam = this.parameters["radius"];
        const radius = typeof radiusParam.getValue() === "number" ? radiusParam.getValue() as number : parseFloat(radiusParam.getValue() as string);
        new scope.Path.Circle({
            center: new scope.Point(centerX, centerY),
            radius: radius,
            strokeColor: 'black'
        });
    }

    getParameters(): Record<string, Parameters> {
        return this.parameters;
    }

    destroy(): void {
        this.paths.forEach(path => path.destroy());
        this.paths = [];
        this.parent = null;
    }
}

export class RadiusParameter implements Parameters {
    value: number | string;

    constructor(value: number | string) {
        this.value = value;
    }

    min(_: Path): number | string {
        return 0;
    }

    max(_: Path): number | string {
        return Infinity;
    }

    getValue(): number | string {
        return this.value;
    }

    setValue(value: number | string): void {
        this.value = value;
    }
}