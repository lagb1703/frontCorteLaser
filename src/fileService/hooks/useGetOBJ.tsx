import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FileService } from "../service/fileService";
import { useRef } from "react";

export function useGetOBJ(
  fileId: string | number | undefined,
): UseQueryResult<Blob, unknown> {
  const fileService = useRef<FileService>(FileService.getInstance());
  return useQuery<Blob, unknown>({
    queryKey: ["file", fileId, "OBJ"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!fileId) throw new Error("File ID is null");
      return await fileService.current.getOBJ(fileId);
    },
    staleTime: Infinity,
  });
}
