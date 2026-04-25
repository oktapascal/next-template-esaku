"use client";

/**
 * @fileoverview Tanstack Query hooks untuk pengelolaan modul terbaru (recent modules).
 * @location src/hooks/useRecentModule.ts
 * @description Menyediakan hook untuk mengambil daftar modul terbaru (useRecentModules) 
 *              dan mencatat modul yang baru saja dibuka (useRecordRecent) dengan optimistic update.
 */

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { type RecentModule } from '@/src/shared/types/module';

// ─── Query Keys ───────────────────────────────────────────────────────────────
 
export const recentModuleKeys = {
    all:  ['recent-modules'] as const,
    list: () => [...recentModuleKeys.all, 'list'] as const,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────
 
async function fetchRecentModules(): Promise<RecentModule[]> {
    const response = await fetch('/api/proxy/modules/recents');
    if (!response.ok) throw new Error('Gagal mengambil recent modules.');

    const data = (await response.json()) as { data: RecentModule[] };
    
    return data.data ?? [];
}

async function postRecordRecent(moduleId: number): Promise<void> {
    const response = await fetch(`/api/proxy/modules/${moduleId}/recents`, { method: 'POST' });
    if (!response.ok) throw new Error('Gagal mencatat modul terbaru.');
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useRecentModules(): UseQueryResult<RecentModule[]> {
    return useQuery({
        queryKey: recentModuleKeys.list(),
        queryFn:  fetchRecentModules,
    });
}

export function useRecordRecent(): UseMutationResult<void, Error, number> {
    const queryClient = useQueryClient();
 
    return useMutation({
        mutationFn: postRecordRecent,
 
        onMutate: async (moduleId) => {
            await queryClient.cancelQueries({ queryKey: recentModuleKeys.list() });
 
            const previous = queryClient.getQueryData<RecentModule[]>(recentModuleKeys.list());
 
            queryClient.setQueryData<RecentModule[]>(recentModuleKeys.list(), (old = []) => {
                const existing = old.find((r) => r.id === moduleId);
                if (!existing) return old;
 
                return [
                    { ...existing, last_accessed_at: new Date().toISOString() },
                    ...old.filter((r) => r.id !== moduleId),
                ].slice(0, 6);
            });
 
            return { previous };
        },
 
        onError: (_err, _moduleId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(recentModuleKeys.list(), context.previous);
            }
        },
 
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: recentModuleKeys.list() });
        },
    });
}