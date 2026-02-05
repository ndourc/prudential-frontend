"use client";
import { useQuery } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type { LicenseHistory, PaginatedResponse } from "@/types/licensing";

export function useLicenseHistory(page = 1) {
  return useQuery<PaginatedResponse<LicenseHistory> | LicenseHistory[]>({
    queryKey: ["license-history", page],
    queryFn: async () => licensingAPI.listLicenseHistory(page),
  });
}
