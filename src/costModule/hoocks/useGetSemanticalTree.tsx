import { useMemo } from "react";
import { parse } from "./../parser/pricing-parser";
export function useGetSemanticalTree(expresion: string) {
  const { root, error } = useMemo(() => {
    try {
      return { root: parse(expresion), error: null };
    } catch (e) {
      return { root: null, error: (e as Error).message };
    }
  }, [expresion]);

  return { root, error };
}
