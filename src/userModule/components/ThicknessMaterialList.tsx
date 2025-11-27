import { useEffect, useState } from "react";
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
import { Card, CardHeader } from "@/components/ui/card";
import { useGetMaterials } from "@/materialModule/hooks";
import { useAdminMaterialThickness } from "../hooks/useAdminMaterialThickness";

function Item(props: { id: string | number }) {
    const { id } = props;
    const thickness = JSON.parse(id as string) as Thickness;

    return <Card >
        <CardHeader className="text-center w-full">
            {thickness.name}
        </CardHeader>
    </Card>;
}

function SortableItem(props: { id: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });

    const style: React.CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item id={props.id} />
        </div>
    );
}


function Container(props: { id: string; items: string[] }) {
    const { id, items } = props;

    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <SortableContext
            id={id}
            items={items}
            strategy={verticalListSortingStrategy}
        >
            <div ref={setNodeRef} className="bg-[#dadada] p-2.5 m-2.5 flex-1">
                {items.map((itemId) => (
                    <SortableItem key={itemId} id={itemId} />
                ))}
            </div>
        </SortableContext>
    );
}

export default function ThicknessMaterialList() {
    const [items, setItems] = useState<Record<string, string[]>>({
        mt: [],
        thickness: [],
    });
    const { data: materials } = useGetMaterials();
    const {
        materialId,
        setMaterialId,
        linkedThicknesses,
        unlinkedThicknesses,
        handleAddThickness,
        handleDeleteThickness
    } = useAdminMaterialThickness();
    useEffect(()=>{
        setItems({
            mt: linkedThicknesses,
            thickness: unlinkedThicknesses,
        });
    }, [linkedThicknesses, unlinkedThicknesses]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    return (
        <div className="flex flex-row">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div>
                    {materials?.map((material: Material) => (
                        <div 
                            onClick={() => {
                                setMaterialId(material.materialId!);
                            }} 
                            className={"p-2 m-2 bg-blue-300 cursor-pointer" + (materialId === material.materialId ? " border-4 border-blue-800" : "")}
                            key={material.materialId}>
                                {material.name}
                            </div>
                    ))}
                </div>
                {
                    Object.keys(items).map((containerId) => (
                        <Container
                            key={containerId}
                            id={containerId}
                            items={items[containerId]}
                        />
                    ))
                }
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
        console.log({ activeContainer, overContainer }, activeContainer !== overContainer);
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
        console.log(activeContainer);
        if(activeContainer === "mt"){
            console.log("add thickness");
            handleAddThickness(JSON.parse(id));
        }
        else{
            console.log("delete thickness");
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
