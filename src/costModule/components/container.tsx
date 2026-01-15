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
         {/* Simplified view for overlay: just show count of children or simple placeholders */}
         <div className="text-xs text-gray-400">
           {item.getChildren().length} elementos
         </div>
      </CardContent>
    </Card>
  )
}

function Operator({ item }: Props) {
  const childrenRefs = useRef<Array<JSX.Element>>([]);

  const { setNodeRef } = useDroppable({ id: item.getId() });

  if (!(item instanceof Composite)) {
    return null;
  }
  childrenRefs.current = item.getChildren().map((child) => (
    <CrossComponent key={child.getId()} item={child} />
  ));
  return (
    <SortableContext id={item.getId()} items={item.getChildren().map(child => child.getId())} strategy={horizontalListSortingStrategy}>
      <Card className="m-2.5 flex-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {/* Added title for visibility in tree */}
            {item.name}
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="bg-[#fafafa] p-2 flex flex-wrap gap-2 min-h-[50px]">
          {childrenRefs.current}
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

  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={[item?.getId() || ""]} strategy={horizontalListSortingStrategy}>
      <Card className="m-2.5 flex-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="bg-[#fafafa] p-2">
          {item ? <CrossComponent item={item} /> : (<div className="text-gray-500">Arrastra un elemento aquí</div>)}
        </CardContent>
      </Card>
    </SortableContext>
  );
}