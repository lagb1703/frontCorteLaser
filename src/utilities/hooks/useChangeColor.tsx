import { useState, useEffect, useCallback } from "react";

export function useChangeColor() {
    const [color, setColor] = useState<string>("#000000ff");
    const generateRandomColor = useCallback(() => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }, []);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setColor(generateRandomColor());
        }, 1500);
        return () => clearInterval(intervalId);
    }, [generateRandomColor]);
    return color;
}