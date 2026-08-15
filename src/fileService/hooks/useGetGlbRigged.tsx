import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import { FileService } from "../service/fileService";

export function useGetGlbRigged(
  fileId: string | number | undefined,
): UseQueryResult<Blob, unknown> {
  const fileService = useRef<FileService>(FileService.getInstance());

  return useQuery<Blob, unknown>({
    queryKey: ["file", fileId, "glb-rigged"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!fileId) throw new Error("File ID is null");

      try {
        return await fileService.current.getGlbRigged(fileId);
      } catch {
        return await fileService.current.getGlb(fileId);
      }
    },
    staleTime: Infinity,
  });
}
