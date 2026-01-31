import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react";
import { useOpenClose } from "@/utilities/hooks";
import { useEffect } from "react";
import {
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { CollapsibleItem } from "../interfaces";


export const variables: CollapsibleItem[] = [{
  title: "precio Material",
  symbol: "materialPrice",
},
{
  title: "precio Espesor",
  symbol: "thicknessPrice",
},
{
  title: "area",
  symbol: "area",
},
{
  title: "peso material",
  symbol: "weight",
},
{
  title: "perímetro",
  symbol: "perimeter",
},
{
  title: "cantidad",
  symbol: "amount",
},
{
  title: "speed",
  symbol: "speed",
},
{
  title: "number",
  symbol: "number",
}
];

export const operations: CollapsibleItem[] = [
  { title: "Suma", symbol: "+", nridad: "*" },
  { title: "Resta", symbol: "-", nridad: "*" },
  { title: "Multiplicación", symbol: "*", nridad: "*" },
  { title: "División", symbol: "/", nridad: 2 },
  { title: "Potenciación", symbol: "**", nridad: 2 },
  {title: "modulo", symbol: "%", nridad: 2 },
  {title: "redondear", symbol: "round", nridad: 1 },
];


interface CollapsibleItemProps {
  item: CollapsibleItem;
  id?: string;
  isSortable?: boolean;
}

export function ItemCard({ item }: { item: CollapsibleItem }) {
  return (
    <Card className="p-2 border-b last:border-0 bg-white" >
      <CardHeader className="p-3">
        <CardTitle className="text-base">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-sm text-gray-500">
          Símbolo: {item.symbol}
        </div>
      </CardContent>
    </Card>
  );
}

function SortableItem({ item, id }: { item: CollapsibleItem, id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <ItemCard item={item} />
    </div>
  );
}

function DraggableItem({ item, id }: { item: CollapsibleItem, id: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id, data: item });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="cursor-grab mb-2">
      <ItemCard item={item} />
    </div>
  );
}

function CollapsibleItem({ item, id, isSortable = false }: CollapsibleItemProps) {
  const uniqueId = id || item.title;
  return isSortable ? <SortableItem item={item} id={uniqueId} /> : <DraggableItem item={item} id={uniqueId} />;
}

export default function SelectionList() {
  const { isOpen: isVariablesOpen, toggle: toggleVariables, close: closeVariables } = useOpenClose(false);
  const { isOpen: isOperationsOpen, toggle: toggleOperations, close: closeOperations } = useOpenClose(false);

  useEffect(() => {
    if (isVariablesOpen) closeOperations();
  }, [isVariablesOpen]);

  useEffect(() => {
    if (isOperationsOpen) closeVariables();
  }, [isOperationsOpen]);

  return (
    <div className="w-full flex flex-col gap-2 min-w-[200px]">
      <Collapsible open={isVariablesOpen} onOpenChange={toggleVariables}>
        <CollapsibleTrigger className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
          <span className="font-medium">Variables</span>
          <ChevronDown
            className={`transition-transform duration-200 ${isVariablesOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 border border-t-0 border-gray-200 rounded-b-md max-h-[200px] overflow-auto">
          {variables.map((item) => (
            <CollapsibleItem key={item.title} item={item} isSortable={false} />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible open={isOperationsOpen} onOpenChange={toggleOperations}>
        <CollapsibleTrigger className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
          <span className="font-medium">Operaciones</span>
          <ChevronDown
            className={`transition-transform duration-200 ${isOperationsOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 border border-t-0 border-gray-200 rounded-b-md max-h-[200px] overflow-auto">
          {operations.map((item) => (
            <CollapsibleItem key={item.title} item={item} isSortable={false} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}