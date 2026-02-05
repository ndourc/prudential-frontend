"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type { Shareholder, PaginatedResponse } from "@/types/licensing";

export function useShareholders(page = 1) {
  return useQuery<PaginatedResponse<Shareholder> | Shareholder[]>({
    queryKey: ["shareholders", page],
    queryFn: async () => licensingAPI.listShareholders(page),
  });
}

export function useCreateShareholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Shareholder>) =>
      licensingAPI.createShareholder(payload),
    onSuccess: () => qc.invalidateQueries(["shareholders"]),
  });
}

export function useShareholder(id?: string) {
  return useQuery({
    queryKey: ["shareholder", id],
    queryFn: async () => {
      if (!id) return null;
      return licensingAPI.getShareholder(id);
    },
    enabled: !!id,
  });
}

export function useUpdateShareholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Shareholder>;
    }) => licensingAPI.updateShareholder(id, payload),
    onSuccess: () => qc.invalidateQueries(["shareholders"]),
  });
}

export function useDeleteShareholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.deleteShareholder(id),
    onSuccess: () => qc.invalidateQueries(["shareholders"]),
  });
}
