import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { Node } from "../interfaces";
import { Leaf, Composite } from "../class/tree";
import { useEffect, useRef, useState, type JSX } from "react";

interface Props {
  item: Node;
}

export function Variable({ item }: Props) {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-sm text-gray-500">
          Símbolo: {item.symbol}
        </div>
      </CardContent>
    </Card>
  )
}

export function OperatorOverlay({ item }: Props) {
  if (!(item instanceof Composite)) return null;
  return (
    <Card className="m-2.5 flex-1 opacity-80 border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {item.name} ({item.symbol})
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-[#fafafa] p-2 flex flex-wrap gap-2">
         <div className="text-xs text-gray-400">
           {item.getChildren().length} elementos
         </div>
      </CardContent>
    </Card>
  )
}

function Operator({ item }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: item.getId() });

  if (!(item instanceof Composite)) {
    return null;
  }
  
  const children = item.getChildren();

  return (
    <SortableContext id={item.getId()} items={children.map(child => child.getId())} strategy={horizontalListSortingStrategy}>
      <Card className={`m-2.5 flex-1 min-w-[200px] h-fit transition-colors duration-200 ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {item.name}
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className={`p-2 flex flex-wrap gap-2 w-full min-h-[50px] rounded-b-lg ${isOver ? 'bg-blue-100/50' : 'bg-[#fafafa]'}`}>
          {children.map((child) => (
            <CrossComponent key={child.getId()} item={child} />
          ))}
        </CardContent>
      </Card>
    </SortableContext>
  )
}

function CrossComponent({ item }: Props) {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
  } = useSortable({ id: item.getId() });

  const style = {
      transform: CSS.Transform.toString(transform),
      transition
  };

  const content = item instanceof Leaf ? <Variable item={item} /> : <Operator item={item} />;

  return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
          {content}
      </div>
  );
}



export default function Container(props: { id: string; item: Node | null }) {
  const { id, item } = props;

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <SortableContext id={id} items={[item?.getId() || ""]} strategy={horizontalListSortingStrategy}>
      <Card className={`m-2.5 flex-1 h-full min-h-[200px] transition-colors duration-200 ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
             Construcción de Fórmula
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className={`p-2 h-full rounded-b-lg ${isOver ? 'bg-blue-100/50' : 'bg-[#fafafa]'}`}>
          {item ? <CrossComponent item={item} /> : (
            <div className="flex items-center justify-center h-40 m-2 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
              <span className="text-gray-400 font-medium">Arrastra una variable u operación aquí para comenzar</span>
            </div>
          )}
        </CardContent>
      </Card>
    </SortableContext>
  );
}