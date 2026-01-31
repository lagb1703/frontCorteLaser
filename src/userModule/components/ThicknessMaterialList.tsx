import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    closestCorners,
    DragOverlay
} from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { type Material } from "@/materialModule/validators/materialValidators";
import { type Thickness } from "@/materialModule/validators/thicknessValidators";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { useGetMaterials } from "@/materialModule/hooks";
import { useAdminMaterialThickness } from "../hooks/useAdminMaterialThickness";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface ItemProps {
    id: string | number;
    changeSpeed?: (thicknessId: string | number, speed: number) => void;
}

const Item = React.memo(function Item({ id, changeSpeed }: ItemProps) {
    const thickness = useMemo(() => JSON.parse(id as string) as Thickness, [id]);
    const [speed, setSpeed] = useState<number>(thickness.speed ?? 0);
    return (
        <Card>
            <CardHeader className="text-center w-full">
                {thickness.name}
            </CardHeader>
            {
                changeSpeed ? (
                    <>
                        <CardContent className="flex flex-col gap-2">
                            <div>Velocidad: </div>
                            <Input
                                type="number"
                                defaultValue={speed}
                                onChange={(e) => {
                                    const newSpeed = Number(e.target.value);
                                    setSpeed(newSpeed);
                                }}
                            />
                        </CardContent>
                        <CardFooter className="text-center w-full">
                            <Button 
                                variant="default" 
                                className="w-full"
                                onClick={() => {
                                    changeSpeed(thickness.thicknessId!, speed);
                                }}
                                >
                                Guardar
                            </Button>
                        </CardFooter>
                    </>
                ) : null
            }
        </Card>
    );
});

interface SortableItemProps {
    id: string;
    changeSpeed?: (thicknessId: string | number, speed: number) => void;
}

const SortableItem = React.memo(function SortableItem({ id, changeSpeed }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: id });

    const style: React.CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item id={id} changeSpeed={changeSpeed} />
        </div>
    );
});

interface ContainerProps {
    id: string;
    items: string[];
    changeSpeed?: (thicknessId: string | number, speed: number) => void;
}

function Container({ id, items, changeSpeed }: ContainerProps) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
            <Card className="m-2.5 flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {id === "mt" ? "Asociados" : "Disponibles"}
                        <Badge>{items.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent ref={setNodeRef} className="bg-[#fafafa] p-2">
                    {items.map((itemId) => (
                        <SortableItem key={itemId} id={itemId} changeSpeed={changeSpeed} />
                    ))}
                </CardContent>
            </Card>
        </SortableContext>
    );
}

export default function ThicknessMaterialList() {
    const [items, setItems] = useState<Record<string, string[]>>({
        mt: [],
        thickness: [],
    });
    const { data: materials, isLoading } = useGetMaterials();
    const {
        materialId,
        setMaterialId,
        linkedThicknesses,
        unlinkedThicknesses,
        handleAddThickness,
        handleChangeSpeed,
        handleDeleteThickness
    } = useAdminMaterialThickness();
    useEffect(() => {
        setItems({
            mt: linkedThicknesses,
            thickness: unlinkedThicknesses,
        });
    }, [linkedThicknesses, unlinkedThicknesses]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    const onMaterialClick = useCallback((id: number | undefined) => {
        if (id != null) setMaterialId(id);
    }, [setMaterialId]);

    return (
        <div className="flex flex-row gap-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-56">
                    <Card className="m-2">
                        <CardHeader>
                            <CardTitle>Materiales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                                </div>
                            ) : (
                                materials?.map((material: Material) => (
                                    <Button
                                        key={material.materialId}
                                        variant={materialId === material.materialId ? "default" : "ghost"}
                                        className={`w-full justify-start mb-2 ${materialId === material.materialId ? "border-2" : ""}`}
                                        onClick={() => onMaterialClick(material.materialId!)}
                                    >
                                        {material.name}
                                    </Button>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
                <Container id={"mt"} items={items["mt"]} changeSpeed={handleChangeSpeed} />
                <Container id={"thickness"} items={items["thickness"]} />
                <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
            </DndContext>
        </div>
    );

    function findContainer(id?: string): string | undefined {
        if (!id) return undefined;
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].includes(id));
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const id = active.id as string | null;
        setActiveId(id);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        const draggingRect = (event as any).draggingRect as { top?: number } | undefined;
        const id = active.id as string;
        const overId = over?.id as string | undefined;

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            // Find the indexes for the items
            const activeIndex = activeItems.indexOf(id);
            const overIndex = overItems.indexOf(overId as string);
            let newIndex: number;
            if (overId && overId in prev) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem =
                    over &&
                    overIndex === overItems.length - 1 &&
                    draggingRect &&
                    (draggingRect.top ?? 0) > (over.rect.top + over.rect.height);

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }
            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item !== id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    prev[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const id = active.id as string;
        const overId = over?.id as string | undefined;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);
        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            setActiveId(null);
            return;
        }

        const activeIndex = items[activeContainer].indexOf(id);
        const overIndex = items[overContainer].indexOf(overId as string);
        if (activeContainer === "mt") {
            handleAddThickness(JSON.parse(id));
        }
        else {
            handleDeleteThickness(JSON.parse(id));
        }
        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
            }));
        }

        setActiveId(null);
    }
}
