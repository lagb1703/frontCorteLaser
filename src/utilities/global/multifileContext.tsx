import { createContext } from "react";

export const MultifileContext = createContext<{
  filesIds: string[];
  setFilesIds: (ids: string[]) => void;
}>({ filesIds: [], setFilesIds: () => {} });

