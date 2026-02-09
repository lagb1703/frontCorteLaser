import { useParams } from "react-router";
import type { Shape } from "../interfaces";
import { 
    CircleShape, 
    RectangleShape, 
    RingShape, 
    RectangleRingShape, 
    CircuferencesShape 
} from "../class/shapes";
import { useEffect, useState, useRef } from "react";

export function useGetShape() {
    const { shapeId } = useParams<{ shapeId: string }>();
    const [shape, setShape] = useState<Shape | null>(null);
    const shapes = useRef<Shape[]>([
        new CircleShape(),
        new RectangleShape(),
        new RingShape(),
        new RectangleRingShape(),
        new CircuferencesShape()
    ]);
    useEffect(() => {
        const foundShape = shapes.current.find(s => s.id === shapeId) || null;
        setShape(foundShape);
    }, [shapeId]);
    return {
        shape,
        shapes: shapes.current
    };
}