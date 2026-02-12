import { useParams } from "react-router";
import type { Shape } from "../interfaces";
import { 
    CircleShape, 
    RectangleShape, 
    RingShape, 
    RectangleRingShape, 
    CircuferencesShape,
    TriangleShape,
    PoligonShape,
    RectangleWithRectBorder,
    RingWithCircles
} from "../class/shapes";
import { useEffect, useState, useRef } from "react";

interface ShapePresentation {
    shape: Shape;
    shapeSpanishName: string;
    imageUrl: string;
}

export function useGetShape() {
    const { shapeId } = useParams<{ shapeId: string }>();
    const [shape, setShape] = useState<Shape | null>(null);
    const shapes = useRef<ShapePresentation[]>([
        {
            shape: new CircleShape(),
            shapeSpanishName: "Círculo",
            imageUrl: "/shapes/circulo.png"
        },
        {
            shape: new RectangleShape(),
            shapeSpanishName: "Rectángulo",
            imageUrl: "/shapes/rectangulo.png"
        },
        {
            shape: new RingShape(),
            shapeSpanishName: "Anillo",
            imageUrl: "/shapes/anillo.png"
        },
        {
            shape: new RectangleRingShape(),
            shapeSpanishName: "Anillo Rectangular",
            imageUrl: "/shapes/rectangulos.png"
        },
        {
            shape: new CircuferencesShape(),
            shapeSpanishName: "Circunferencias",
            imageUrl: "/shapes/circulos.png"
        },
        {
            shape: new TriangleShape(),
            shapeSpanishName: "Triángulo",
            imageUrl: "/shapes/triangulo.png"
        },
        {
            shape: new PoligonShape(),
            shapeSpanishName: "Polígono",
            imageUrl: "/shapes/poligono.png"
        },
        {
            shape: new RectangleWithRectBorder(),
            shapeSpanishName: "Rectángulo con borde rectangular",
            imageUrl: "/shapes/rectangulo_con_borde.png"
        },
        {
            shape: new RingWithCircles(),
            shapeSpanishName: "Anillo con círculos",
            imageUrl: "/shapes/anillo_con_circulos.png"
        }
    ]);
    useEffect(() => {
        const foundShape = shapes.current.find(s => s.shape.id === shapeId) || null;
        if (foundShape)
        setShape(foundShape.shape);
    }, [shapeId]);
    return {
        shape,
        shapes: shapes.current
    };
}