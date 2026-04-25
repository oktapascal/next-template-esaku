/**
 * @fileoverview Zustand store untuk client state portal.
 * @location src/store/portalStore.ts
 * @description Mengelola state aplikasi di sisi client termasuk data user (dari cookie),
 *              modul aktif, tab aktif, pencarian, serta flag UI seperti konfirmasi logout.
 */

import { create } from 'zustand';
import { type CurrentUser } from '@/src/lib/auth/getCurrentUser';
import { USER_COOKIE_NAME } from '@/src/app/services/authService';

// ─── Types ────────────────────────────────────────────────────────────────────
 
export type PortalTab = 'all' | 'favorite' | 'recent';

interface PortalState {
    currentUser: CurrentUser | null;
    activeModuleId: number | null;
    activeTab: PortalTab;
    searchQuery: string;
    isLogoutConfirmVisible: boolean;
    togglingModuleId: number | null;

    initUser: () => void;
    setActiveModule: (moduleId: number) => void;
    setTab: (tab: PortalTab) => void;
    setSearchQuery: (query: string) => void;
    showLogoutConfirm: () => void;
    hideLogoutConfirm: () => void;
    setTogglingModuleId: (id: number | null) => void;
    toggleFavoriteOptimistic: (moduleId: number) => void;
    clearSession: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePortalStore = create<PortalState>((set) => ({

    currentUser:            null,
    activeModuleId:         null,
    activeTab:              'all',
    searchQuery:            '',
    isLogoutConfirmVisible: false,
    togglingModuleId:       null,

    /**
     * Baca user dari cookie 'user' (non-HttpOnly) — tidak ada fetch ke backend.
     * Dipanggil sekali saat portal mount.
     */
    initUser: () => {
        const raw = getCookieValue(USER_COOKIE_NAME);
        if (!raw) { set({ currentUser: null }); return; }
 
        try {
            set({ currentUser: JSON.parse(fullyDecode(raw)) as CurrentUser });
        } catch {
            set({ currentUser: null });
        }
    },

    setActiveModule: (moduleId) => set({ activeModuleId: moduleId }),
 
    setTab: (tab) => set({ activeTab: tab, searchQuery: '' }),
 
    setSearchQuery: (query) => set({ searchQuery: query }),
 
    showLogoutConfirm: () => set({ isLogoutConfirmVisible: true }),
 
    hideLogoutConfirm: () => set({ isLogoutConfirmVisible: false }),
 
    setTogglingModuleId: (id) => set({ togglingModuleId: id }),

    /**
     * 
     * Flip is_favorite secara optimistik sebelum request selesai.
     * Rollback dilakukan via initUser() jika request gagal.
     * 
    */
    toggleFavoriteOptimistic: (moduleId) => set((state) => {
        if (!state.currentUser) return state;
 
        return {
            currentUser: {
                ...state.currentUser,
                permissions: state.currentUser.permissions.map((p) =>
                    p.id === moduleId ? { ...p, is_favorite: !p.is_favorite } : p,
                ),
            },
        };
    }),

    clearSession: () => set({
        currentUser:            null,
        activeModuleId:         null,
        activeTab:              'all',
        searchQuery:            '',
        isLogoutConfirmVisible: false,
        togglingModuleId:       null,
    }),

}));

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentUser    = (s: PortalState) => s.currentUser;
export const selectActiveModuleId = (s: PortalState) => s.activeModuleId;
export const selectActiveTab      = (s: PortalState) => s.activeTab;
export const selectSearchQuery    = (s: PortalState) => s.searchQuery;
 
function toNonEmpty(value: string | null | undefined): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export const selectDisplayName = (s: PortalState) =>
    toNonEmpty(s.currentUser?.karyawan?.nama_karyawan) ??
    toNonEmpty(s.currentUser?.username) ??
    '-';
 
export const selectDisplayRole = (s: PortalState) => toNonEmpty(s.currentUser?.role?.name) ?? '-';
 
export const selectNikKaryawan = (s: PortalState) => toNonEmpty(s.currentUser?.karyawan?.nik_karyawan) ?? '-';

export const selectNamaKaryawan = (s: PortalState) => toNonEmpty(s.currentUser?.karyawan?.nama_karyawan) ?? '-';
 
export const selectAllPermissions = (s: PortalState) => s.currentUser?.permissions ?? [];
 
export const selectFavoritePermissions = (s: PortalState) => (s.currentUser?.permissions ?? []).filter((p) => p.is_favorite);

export const selectFilteredPermissions = (s: PortalState) => {
    const query = s.searchQuery.trim().toLowerCase();
    const all   = s.currentUser?.permissions ?? [];
    
    if (!query) return all;
    
    return all.filter((p) => p.nama_module.toLowerCase().includes(query) || p.kode_module.toLowerCase().includes(query));
};

export const selectDisplayInitials = (s: PortalState): string => {
    const name = toNonEmpty(s.currentUser?.karyawan?.nama_karyawan) ?? toNonEmpty(s.currentUser?.username) ?? '';
    const words = name.trim().split(/\s+/).filter(Boolean);
    
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    
    return words.slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getCookieValue(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=').slice(1).join('=');
}

/**
 * Decode string yang mungkin ter-encode satu atau lebih kali (percent-encoding).
 * Berhenti ketika tidak ada lagi sequence `%XX` yang bisa di-decode.
 * Aman terhadap string biasa (tanpa encoding) karena loop tidak akan berjalan.
 */
function fullyDecode(value: string): string {
    let current = value;
    while (/%[0-9A-Fa-f]{2}/.test(current)) {
        const next = decodeURIComponent(current);
        if (next === current) break; // tidak ada perubahan, stop
        current = next;
    }
    return current;
}
