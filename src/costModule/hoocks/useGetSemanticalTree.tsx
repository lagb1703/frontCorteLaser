import { useState, useEffect } from "react";
import type { ASTNode } from "../parser/ast";
import {parse} from "./../parser/pricing-parser"
export function useGetSemanticalTree(expresion: string) {
    const [root, setRoot] = useState<ASTNode | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const ast = parse(expresion);
            setRoot(ast);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
            setRoot(null);
        }
    }, [expresion]);

    return { root, error };
}