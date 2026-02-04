import { useState, useCallback } from "react";
import { useGetShape, useRender } from "../hooks";
import type { Parameters } from "../class/paths/parameters";
import { Input } from "@/components/ui/input";
import _ from "paper";

interface InputShapeProps {
    parameter: Parameters;
    scope: paper.PaperScope;
}

function InputShape({ parameter, scope }: InputShapeProps) {
    const [value, setValue] = useState(parameter.getValue());
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const max = parameter.max(scope) - 1;
        const min = parameter.min(scope);
        const newValue = Number(e.target.value);
        if(max < newValue) {
            setValue(max);
            parameter.setValue(max, scope);
            return;
        }
        if(min > newValue) {
            setValue(min);
            parameter.setValue(min, scope);
            return;
        }
        setValue(newValue);
        parameter.setValue(newValue, scope);
    }, [parameter, scope]);
    return (
        <Input type="number" value={value} onChange={onChange} />
    );
}

export function ShapeRender() {
    const { shape } = useGetShape();
    const { canvas, scope } = useRender(shape);

    return (
        <main className="w-full h-full flex flex-col">
            <div className="flex-1 w-full relative">
                <canvas className="w-full h-full absolute inset-0" ref={canvas} />
            </div>
            <div className="p-4">
                {shape && shape.getPaths().map((path) => {
                    const params = path.getParameters();
                    return <>
                        <h2 key={path.id}>{path.id}</h2>
                        {Object.entries(params).map(([key, parameter]) => {
                            if (!parameter.willChange) return null;
                            return (
                                <div key={key}>
                                    <label>{key}:</label>
                                    <InputShape parameter={parameter} scope={scope.current!} />
                                </div>
                            )
                        })}
                    </>
                })}
            </div>
        </main>
    );
}