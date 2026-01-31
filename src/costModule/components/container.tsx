import {
  useDroppable,
} from "@dnd-kit/core";
import { Fragment, type Dispatch, type SetStateAction } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { Node } from "../interfaces";
import { Leaf, Composite } from "../class/tree";
import { Input } from "@/components/ui/input";
import { useSymbol } from "../hoocks";

interface Props {
  item: Node;
  root: Node;
  setRoot: Dispatch<SetStateAction<Node | null>>;
}

export function Variable({ item, root, setRoot }: Props) {
  const { symbol, setSymbol } = useSymbol(item, root, setRoot);
  return (
    <Card>
      <CardContent className="p-3 pt-0">
        {item.name !== "number" ? (
          <div className="text-sm text-gray-500">
            {symbol}
          </div>
        ) : (<div>
          <Input
            type="number"
            placeholder="Ingrese un número"
            className="w-full"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>)}
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
      <CardContent className="bg-[#fafafa] p-2 flex flex-wrap items-center justify-center gap-2">
        <div className="text-xs text-gray-400">
          {item.getChildren().length} elementos
        </div>
      </CardContent>
    </Card>
  )
}

function Operator({ item, root, setRoot }: Props) {
  const { setNodeRef, isOver, active } = useDroppable({ id: item.getId() });

  if (!(item instanceof Composite)) {
    return null;
  }

  const children = item.getChildren();

  return (
    <SortableContext id={item.getId()} items={children.map(child => child.getId())} strategy={horizontalListSortingStrategy}>
      <Card className={`m-2.5 flex-1 h-fit transition-colors duration-200 ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <CardContent ref={setNodeRef} className={`flex flex-wrap items-center justify-start gap-2 w-full min-h-[50px] ${isOver ? 'bg-blue-100/50' : 'bg-[#fafafa]'}`}>
          {children.map((child, index) => {
            const nridad: number = item.nridad === "*" ? Infinity : Number(item.nridad);
            if(child.getId() === active?.id){
              return null;
            }
            return <Fragment key={child.getId()}>
              {nridad === 1 && <span className="self-center text-gray-400 mx-1"> {item.symbol} </span>}
              <CrossComponent item={child} root={root} setRoot={setRoot} />
              {index < children.length - 1 && nridad > 1 && <span className="self-center text-gray-400 mx-1"> {item.symbol} </span>}
            </Fragment>
          })}
        </CardContent>
      </Card>
    </SortableContext>
  )
}

function CrossComponent({ item, root, setRoot }: Props) {
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

  const content = item instanceof Leaf ? <Variable item={item} root={root} setRoot={setRoot} /> : <Operator item={item} root={root} setRoot={setRoot} />;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      {content}
    </div>
  );
}

interface ContainerProps {
  id: string;
  item: Node | null;
  setRoot: Dispatch<SetStateAction<Node | null>>
}

export default function Container({ id, item, setRoot }: ContainerProps) {

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
          {item ? <CrossComponent item={item} root={item} setRoot={setRoot} /> : (
            <div className="flex items-center justify-center h-40 m-2 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
              <span className="text-gray-400 font-medium">Arrastra una variable u operación aquí para comenzar</span>
            </div>
          )}
        </CardContent>
      </Card>
    </SortableContext>
  );
}