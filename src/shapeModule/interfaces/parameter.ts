import type { Path } from "./path";
export interface Parameters {
    value: number | string;
    min(path: Path): number | string;
    max(path: Path): number | string;
    getValue(): number | string;
    setValue(value: number | string): void;
}