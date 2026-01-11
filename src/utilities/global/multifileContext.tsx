import { createContext, useState, useCallback, useEffect } from "react";

export const MultifileContext = createContext<{filesIds: string[], setFilesIds: (ids: string[]) => void}>({ filesIds: [], setFilesIds: () => {} });

export function MultifileProvider({ children }: { children: React.ReactNode}) {
    const [filesIds, setFilesIds] = useState<string[]>([]);
    useEffect(()=>{
        console.log("Current files IDs in context:", filesIds);
    }, [filesIds]);
    const setFilesIdsCallback = useCallback((ids: string[])=>{
        setFilesIds(ids);
    }, []);
    return (
        <MultifileContext.Provider value={{ filesIds, setFilesIds: setFilesIdsCallback }}>
            {children}
        </MultifileContext.Provider>
    );
}