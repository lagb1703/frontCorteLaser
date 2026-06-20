import { useState, useCallback } from "react";
import { MultifileContext } from "./multifileContext";

export function MultifileProvider({ children }: { children: React.ReactNode }) {
  const [filesIds, setFilesIds] = useState<string[]>([]);
  const setFilesIdsCallback = useCallback((ids: string[]) => {
    setFilesIds(ids);
  }, []);
  return (
    <MultifileContext.Provider
      value={{ filesIds, setFilesIds: setFilesIdsCallback }}
    >
      {children}
    </MultifileContext.Provider>
  );
}
