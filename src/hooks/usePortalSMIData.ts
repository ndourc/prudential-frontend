"use client";
import { useQuery } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type { PortalSMIData, PaginatedResponse } from "@/types/licensing";

export function usePortalSMIData(page = 1) {
  return useQuery<PaginatedResponse<PortalSMIData> | PortalSMIData[]>({
    queryKey: ["portal-smi-data", page],
    queryFn: async () => licensingAPI.listPortalSMIData(page),
  });
}
