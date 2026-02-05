"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type { Director, PaginatedResponse } from "@/types/licensing";

export function useDirectors(page = 1) {
  return useQuery<PaginatedResponse<Director> | Director[]>({
    queryKey: ["directors", page],
    queryFn: async () => licensingAPI.listDirectors(page),
  });
}

export function useCreateDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Director>) =>
      licensingAPI.createDirector(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["directors"] }),
  });
}

export function useUpdateDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Director> }) =>
      licensingAPI.updateDirector(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["directors"] }),
  });
}

export function useDeleteDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.deleteDirector(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["directors"] }),
  });
}

export function useDirector(id?: string) {
  return useQuery({
    queryKey: ["director", id],
    queryFn: async () => {
      if (!id) return null;
      return licensingAPI.getDirector(id);
    },
    enabled: !!id,
  });
}
