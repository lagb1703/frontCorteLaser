import { useParams } from "react-router";
import type { Shape } from "../interfaces";
import { CircleShape } from "../class/shapes";
import { useEffect, useState } from "react";

const shapes: Shape[] = [
    new CircleShape(),
];

export function useGetShape() {
    const { shapeId } = useParams<{ shapeId: string }>();
    const [shape, setShape] = useState<Shape | null>(null);
    useEffect(()=>{
        const foundShape = shapes.find(s => s.id === shapeId) || null;
        setShape(foundShape);
    }, [shapeId]);
    return {
        shape,
        shapes
    };
}