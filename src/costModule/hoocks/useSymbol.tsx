import { useState, useEffect } from "react";
import { Leaf } from "../class/tree";


export function useSymbol(item: Leaf) {
    const [symbol, setSymbol] = useState<string>(item.symbol);
    useEffect(() => {
        item.symbol = symbol;
    }, [symbol, item]);
    return { symbol, setSymbol };
}