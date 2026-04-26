/**
 * @fileoverview Hook untuk fetch menu sidebar berdasarkan modul aktif.
 * @location src/hooks/useMenu.ts
 *
 * Endpoint  : GET /modules/{module_id}/menus (via proxy → /api/proxy/modules/{id}/menus)
 * Auth      : ditangani apiClient di server — client cukup hit /api/proxy/*
 * Cache     : 5 menit (staleTime) — menu jarang berubah antar navigasi
 * Enabled   : hanya jika activeModuleId tersedia di portalStore
 */

import { useQuery } from '@tanstack/react-query';
import { usePortalStore, selectActiveModuleId } from '@/src/store/portalStore';
import { MenuItem, MenuApiResponse } from '@/src/shared/types/menu';

async function fetchMenu(moduleId: number): Promise<MenuItem[]> {

  const res = await fetch(`/api/proxy/modules/${moduleId}/menus`);
 
  if (!res.ok) {
    throw new Error(`Gagal memuat menu (${res.status})`);
  }
 
  const json: MenuApiResponse = await res.json();
  return json.data ?? [];

}

export function useMenu() {

  const activeModuleId = usePortalStore(selectActiveModuleId);
 
  return useQuery({
    queryKey:  ['menu', activeModuleId],
    queryFn:   () => fetchMenu(activeModuleId!),
    enabled:   activeModuleId !== null,
    staleTime: 1000 * 60 * 5,  // 5 menit
    placeholderData: [],
  });
  
}