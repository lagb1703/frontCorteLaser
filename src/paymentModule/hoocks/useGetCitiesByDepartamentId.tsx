import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { CityType } from "../types";

export const useGetCitiesByDepartamentId = (departamentId?: number): UseQueryResult<CityType[]> => {
    return useQuery<CityType[]>({
        queryKey: ["cities", departamentId],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        queryFn: async  () => {
            if(!departamentId) {
                return [];
            }
            const response = await fetch(`https://api-colombia.com/api/v1/Department/${departamentId}/cities?sortBy=name&sortDirection=asc`);
            if(response.status !== 200) {
                throw new Error("Error fetching acceptance tokens");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 60 * 60 * 1000, // 1 hora
    });
};