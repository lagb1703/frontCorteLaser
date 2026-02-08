import { useState, useCallback } from "react";
import { useGetShape, useRender } from "../hooks";
import type { Parameters } from "../class/paths/parameters";
import { Input } from "@/components/ui/input";
import _ from "paper";

interface InputShapeProps {
    parameter: Parameters;
    scope: paper.PaperScope;
    name: string;
}

function InputShape({ parameter, scope, name }: InputShapeProps) {
    const [value, setValue] = useState(parameter.getValue());
    const onClick = useCallback(() => {
        parameter.displayMeasure(name, scope);
    }, [parameter, name, scope]);
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
        parameter.displayMeasure(name, scope);
    }, [parameter, name, scope]);
    return (
        <Input type="number" value={value} onChange={onChange} onClick={onClick}/>
    );
}

export function ShapeRender() {
    const { shape } = useGetShape();
    const { canvas, scope } = useRender(shape);

    return (
        <div className="w-full h-full flex flex-row flex-wrap justify-center items-start">
            <div className="flex min-w-[400px] basis-full lg:max-w-[70%] h-[500px] lg:h-full justify-center items-center px-2">
                <div className="w-[90%] h-[90%]">
                    <canvas className="w-full h-full border border-black rounded-md inset-0" ref={canvas} />
                </div>
            </div>
            <section className="basis-full lg:basis-[20%] lg:mt-10 lg:h-full justify-center items-start overflow-y-auto">
                {shape && shape.getPaths().map((path) => {
                    const params = path.getParameters();
                    return <article key={path.id} className="px-20 lg:px-0">
                        <h2>{path.id}</h2>
                        {Object.entries(params).map(([key, parameter]) => {
                            if (!parameter.willChange) return null;
                            const name = key.includes('---') ? key.split('---')[1] : key;
                            return (
                                <div key={key} className="mb-2">
                                    <label>{name}:</label>
                                    <InputShape parameter={parameter} name={name} scope={scope.current!} />
                                </div>
                            )
                        })}
                    </article>
                })}
            </section>
        </div>
    );
}