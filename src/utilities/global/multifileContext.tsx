import { createContext, useState, useCallback } from "react";

export const MultifileContext = createContext<{filesIds: string[], setFilesIds: React.Dispatch<React.SetStateAction<string[]>>}>({ filesIds: [], setFilesIds: () => {} });

export function MultifileProvider({ children }: { children: React.ReactNode}) {
    const [filesIds, setFilesIds] = useState<string[]>([]);
    const setFilesIdsCallback = useCallback(setFilesIds, []);
    return (
        <MultifileContext.Provider value={{ filesIds, setFilesIds: setFilesIdsCallback }}>
            {children}
        </MultifileContext.Provider>
    );
}