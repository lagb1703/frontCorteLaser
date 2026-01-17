import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  pointerWithin
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SelectionList, { ItemCard, variables, operations } from "./selectionList";
import Container, { Variable, OperatorOverlay } from "./container";
import { useSematicalTree } from "../hoocks";
import type { CollapsibleItem, Node } from "../interfaces";
import { Composite, Leaf } from "../class/tree";
import { Button } from "@/components/ui/button";

export default function PriceCalculatorChange() {
  const [activeSidebarItem, setActiveSidebarItem] = useState<CollapsibleItem | null>(null);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const { root, addNewNode, moveNode, deleteNode, getSematicalTree } = useSematicalTree();

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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeId = active.id as string;

    // Check sidebar first
    const sidebarItem = [...variables, ...operations].find(i => i.title === activeId);
    if (sidebarItem) {
      setActiveSidebarItem(sidebarItem);
      setActiveNode(null);
      return;
    }

    // Check tree nodes
    if (root) {
      const node = root.find(activeId);
      if (node) {
        setActiveNode(node);
        setActiveSidebarItem(null);
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    // const { active, over } = event;
    // console.log("Drag Over:", { active, over });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log("Drag End:", { active, over });

    setActiveSidebarItem(null);
    setActiveNode(null);

    const activeId = active.id as string;

    if (!over) {
      console.log("Dropped outside any valid target.");
      deleteNode(activeId);
      return;
    }
    const overId = over.id as string;
    const sidebarItem = [...variables, ...operations].find(i => i.title === activeId);
    if (sidebarItem) {
      const newNode = sidebarItem.nridad ? new Composite(sidebarItem.symbol, sidebarItem.title, sidebarItem.nridad!) : new Leaf(sidebarItem.symbol, sidebarItem.title);

      if (overId === "canvas-area") {
        addNewNode(newNode, "");
      } else {
        // Try to add to the dropped node
        const parentNode = root?.find(overId);
        if (parentNode && parentNode instanceof Composite) {
          addNewNode(newNode, overId);
        }
      }
    } else {
      // Moving existing node inside tree
      if (overId === "canvas-area") {
        moveNode(activeId, "");
      } else {
        moveNode(activeId, overId);
      }
    }
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <section className="flex gap-3 h-fit flex-wrap">
          <div className="basis-full lg:basis-[25%]">
            <SelectionList />
          </div>
          <div className="basis-full lg:basis-[70%]">
            <Container id="canvas-area" item={root} />
          </div>
        </section>
        <DragOverlay>
          {activeSidebarItem ? <ItemCard item={activeSidebarItem} /> : null}
          {activeNode ? (
            activeNode instanceof Leaf ? <Variable item={activeNode} /> : <OperatorOverlay item={activeNode} />
          ) : null}
        </DragOverlay>
      </DndContext>
      <div
        className="w-full flex justify-center lg:justify-end lg:p-10">
        <Button className="mt-4 p-7" onClick={()=>{
          console.log(getSematicalTree());
        }}>Guardar Cambios</Button>
      </div>
    </div>
  );
}