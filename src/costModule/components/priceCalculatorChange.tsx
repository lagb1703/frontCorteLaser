import { useState, useEffect } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  pointerWithin
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SelectionList, { ItemCard, variables, operations } from "./selectionList";
import Container, { Variable, OperatorOverlay } from "./container";
import { useSematicalTree, useGetSemanticalTree } from "../hoocks";
import type { CollapsibleItem, Node } from "../interfaces";
import { Composite, Leaf } from "../class/tree";
import { Button } from "@/components/ui/button";
import { useGetPriceCalculator, usePostPriceCalculator } from "@/fileService/hooks";
import { toast } from "sonner";
import type { ASTNode } from "../parser/ast";

function AstToNode(ast: ASTNode): Node {
  if (Array.isArray(ast)) {
    const newNode = ast[2];
    if (typeof newNode === "string") {
      throw new Error("Invalid AST structure");
    }
    return AstToNode(newNode);
  }
  switch (ast.type) {
    case "BinaryExpression":
      const nridad = ast.operator === "/" || ast.operator === "**" || ast.operator === "%" || ast.operator === "//" ? 2 : "*";
      return new Composite(ast.operator, ast.operator, nridad);
    case "UnaryExpression":
      return new Composite(ast.operator, ast.operator, 1);
    case "CallExpression":
      return new Composite(ast.callee, ast.callee, ast.args.length);
    case "Identifier":
      return new Leaf(ast.name, ast.name);
    case "NumberLiteral":
      return new Leaf(ast.value.toString(), "number");
  }
}

export default function PriceCalculatorChange() {
  const [activeSidebarItem, setActiveSidebarItem] = useState<CollapsibleItem | null>(null);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const { root, setRoot, addNewNode, moveNode, deleteNode, getSematicalTree } = useSematicalTree();
  const { data: priceCalculator } = useGetPriceCalculator();
  const { root: semanticalRoot } = useGetSemanticalTree(priceCalculator || "");
  const postPriceCalculator = usePostPriceCalculator();
  useEffect(() => {
    if (!semanticalRoot) {
      return;
    }
    const quenque: ASTNode[] = [semanticalRoot];
    const newRoot = AstToNode(semanticalRoot);
    const treeNodes: Node[] = [newRoot];
    console.log(quenque)
    while (quenque.length > 0) {
      const current = quenque.shift()!;
      const currentNode = treeNodes.shift()!;
      console.log(current);
      if (Array.isArray(current)) {
        const child = current[2];
        if (typeof child === "string") {
          continue;
        }
        quenque.push(child);
        treeNodes.push(currentNode);
        continue;
      }
      if (typeof current === "string") {
        continue;
      }
      if (!Array.isArray(current) && current.type === "BinaryExpression") {
        const leftNode = AstToNode(current.left);
        const rightNode = AstToNode(current.right);
        (currentNode as Composite).add(leftNode);
        (currentNode as Composite).add(rightNode);
        quenque.push(current.left, current.right);
        treeNodes.push(leftNode, rightNode);
        continue;
      }
      if (!Array.isArray(current) && current.type === "UnaryExpression") {
        const argNode = AstToNode(current.argument);
        (currentNode as Composite).add(argNode);
        quenque.push(current.argument);
        treeNodes.push(argNode);
        continue;
      }
      if (!Array.isArray(current) && current.type === "CallExpression") {
        for (const arg of current.args) {
          const argNode = AstToNode(arg);
          (currentNode as Composite).add(argNode);
          quenque.push(arg);
          treeNodes.push(argNode);
        }
        continue;
      }
    }
    setRoot(newRoot);
  }, [semanticalRoot]);

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

    const sidebarItem = [...variables, ...operations].find(i => i.title === activeId);
    if (sidebarItem) {
      setActiveSidebarItem(sidebarItem);
      setActiveNode(null);
      return;
    }

    if (root) {
      const node = root.find(activeId);
      if (node) {
        setActiveNode(node);
        setActiveSidebarItem(null);
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveSidebarItem(null);
    setActiveNode(null);

    const activeId = active.id as string;

    if (!over) {
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
        const parentNode = root?.find(overId);
        if (parentNode && parentNode instanceof Composite) {
          addNewNode(newNode, overId);
        }
      }
    } else {
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
        <Button className="mt-4 p-7" onClick={() => {
          const tree: string = getSematicalTree();
          console.log(tree);
          const toastId = toast.loading("Guardando calculadora de precios...");
          try {
            postPriceCalculator.mutate(tree);
            toast.success("Calculadora de precios guardada correctamente", { id: toastId });
          } catch (e) {
            toast.error("Error al guardar la calculadora de precios");
          }
        }}>Guardar Cambios</Button>
      </div>
    </div>
  );
}