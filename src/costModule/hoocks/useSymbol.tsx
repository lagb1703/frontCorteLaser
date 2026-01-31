import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Leaf } from "../class/tree";
import type { Node } from "../interfaces";


export function useSymbol(item: Leaf, root: Node, setRoot: Dispatch<SetStateAction<Node | null>>) {
    const [symbol, setSymbol] = useState<string>(item.symbol);
    useEffect(() => {
        if(!root) return;
        item.symbol = symbol;
        const newRoot = Object.create(Object.getPrototypeOf(root));
        Object.assign(newRoot, root);
        setRoot(newRoot);
    }, [symbol, item]);
    return { symbol, setSymbol };
}