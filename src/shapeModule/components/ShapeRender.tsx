import { useState, useCallback } from "react";
import { useGetShape, useRender } from "../hooks";
import type { Parameters } from "../interfaces";
import { Input } from "@/components/ui/input";

interface InputShapeProps {
    parameter: Parameters;
}

function InputShape({ parameter }: InputShapeProps) {
    const [value, setValue] = useState(parameter.value);
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        parameter.setValue(isNaN(Number(newValue)) ? newValue : Number(newValue));
    }, [parameter]);
    return (
        <Input type="number" value={value} onChange={onChange} />
    );
}

export function ShapeRender() {
    const { shape } = useGetShape();
    const { canvas } = useRender(shape);

    return (
        <main>
            <canvas className="" ref={canvas} />
            {shape && shape.getPaths().map((path) => {
                const params = path.getParameters();
                return <>
                    <h2 key={path.id}>{path.id}</h2>
                    {Object.entries(params).map(([key, parameter]) => (
                        <div key={key}>
                            <label>{key}:</label>
                            <InputShape parameter={parameter} />
                        </div>
                    ))}
                </>
            })}
        </main>
    );
}