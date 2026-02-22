import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { DepartmentType } from "../types";

export const useGetDepartaments = (): UseQueryResult<DepartmentType[]> => {
    return useQuery<DepartmentType[]>({
        queryKey: ["departaments"],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async  () => {
            const response = await fetch("https://api-colombia.com/api/v1/Department?sortBy=name&sortDirection=asc");
            if(response.status !== 200) {
                throw new Error("Error fetching acceptance tokens");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 60 * 60 * 1000, // 1 hora
    });
};