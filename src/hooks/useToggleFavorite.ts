"use client";

/**
 * @fileoverview Tanstack Query mutation hook untuk toggle favorit modul.
 * @location src/hooks/useToggleFavorite.ts
 * @description Menangani perubahan status favorit modul dengan optimistic update di store 
 *              dan menyediakan mekanisme rollback via initUser() jika mutasi gagal.
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { usePortalStore } from '@/src/store/portalStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToggleFavoritePayload {
    moduleId: number;
    isFavorite: boolean;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

async function postToggleFavorite({ moduleId, isFavorite }: ToggleFavoritePayload): Promise<void> {
    const method = isFavorite ? 'DELETE' : 'POST';
    const response = await fetch(`/api/proxy/modules/${moduleId}/favorites`, { method });
    if (!response.ok) throw new Error('Gagal toggle favorit.');
}

function persistCurrentUserToCookie(): void {
    const currentUser = usePortalStore.getState().currentUser;
    if (!currentUser) return;

    const encoded = encodeURIComponent(JSON.stringify(currentUser));
    document.cookie = `user=${encoded}; path=/; samesite=lax`;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToggleFavorite(): UseMutationResult<void, Error, ToggleFavoritePayload> {

    const initUser = usePortalStore((s) => s.initUser);
    const setTogglingId = usePortalStore((s) => s.setTogglingModuleId);
    const toggleFavoriteOptimistic = usePortalStore((s) => s.toggleFavoriteOptimistic);

    return useMutation({
        mutationFn: postToggleFavorite,

        onMutate: ({ moduleId }) => {
            setTogglingId(moduleId);
            toggleFavoriteOptimistic(moduleId); // UI langsung responsif
        },

        onSuccess: async () => {
            // Gunakan state optimistik yang sudah terbukti sukses sebagai sumber kebenaran,
            // agar UI tidak tertimpa data stale dari endpoint lain.
            persistCurrentUserToCookie();
        },

        onError: (err) => {
            console.error('Gagal toggle favorit:', err);
            // Rollback optimistic update dari cookie yang belum berubah
            initUser();
        },

        onSettled: () => {
            setTogglingId(null);
        },
    });
    
}
