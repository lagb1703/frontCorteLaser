import { useParams } from "react-router";
import type { Shape } from "../interfaces";
import { CircleShape } from "../class/shapes";
import { useMemo } from "react";

const shapes: Shape[] = [
    new CircleShape(),
];

export function useGetShape() {
    const { shapeId } = useParams<{ shapeId: string }>();
    const shape = useMemo(() => shapes.find(s => s.id === shapeId) || null, [shapeId]);
    return {
        shape,
        shapes
    };
}