"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import coreAPI from "@/service/core";
import type { SMI, PaginatedResponse } from "@/types/core";

export function useSMIs(page = 1) {
  return useQuery<PaginatedResponse<SMI> | SMI[]>({
    queryKey: ["smis", page],
    queryFn: async () => coreAPI.listSMIs(page),
  });
}

export function useCreateSMI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SMI>) => coreAPI.createSMI(payload as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smis"] }),
  });
}

export function useUpdateSMI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SMI> }) =>
      coreAPI.updateSMI(id, payload as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smis"] }),
  });
}

export function useDeleteSMI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteSMI(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smis"] }),
  });
}

export function useSMI(id?: string) {
  return useQuery({
    queryKey: ["smi", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getSMI(id);
    },
    enabled: !!id,
  });
}

// SMI dashboard & summary
export function useSMIDashboard() {
  return useQuery({
    queryKey: ["smis", "dashboard"],
    queryFn: async () => coreAPI.getSMIDashboard(),
  });
}

export function useSMISummary() {
  return useQuery({
    queryKey: ["smis", "summary"],
    queryFn: async () => coreAPI.getSMISummary(),
  });
}

export function useSMIFinancialSummary(id?: string) {
  return useQuery({
    queryKey: ["smi", id, "financial_summary"],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getSMIFinancialSummary(id);
    },
    enabled: !!id,
  });
}

export function useSMIRiskProfile(id?: string) {
  return useQuery({
    queryKey: ["smi", id, "risk_profile"],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getSMIRiskProfile(id);
    },
    enabled: !!id,
  });
}

export default {};
