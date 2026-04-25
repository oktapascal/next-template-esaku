import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useShallow } from 'zustand/react/shallow';

import {
    usePortalStore,
    selectDisplayName,
    selectDisplayRole,
    selectNikKaryawan,
    selectDisplayInitials,
    selectAllPermissions,
    selectFavoritePermissions,
    selectFilteredPermissions,
    selectActiveTab,
    selectSearchQuery,
} from '@/src/store/portalStore';

import { useRecentModules, useRecordRecent } from '@/src/hooks/useRecentModule';
import { useToggleFavorite } from '@/src/hooks/useToggleFavorite';
import { openModule as _openModule, hasConfiguredDefaultView } from '@/src/lib/portal/moduleNavigation';

export function usePortal() {
    const router = useRouter();
 
    // ── Zustand ────────────────────────────────────────────────────────────────
    const {
        initUser,
        setActiveModule,
        setTab,
        setSearchQuery,
        showLogoutConfirm,
        hideLogoutConfirm,
        clearSession,
        isLogoutConfirmVisible,
        togglingModuleId,
        currentUser,
        activeModuleId,
    } = usePortalStore();
 
    // ── Tanstack Query ─────────────────────────────────────────────────────────
    const { data: recentModules = [], isLoading: isRecentLoading } = useRecentModules();
    const { mutate: recordRecent }   = useRecordRecent();
    const { mutate: toggleFavorite } = useToggleFavorite();
 
    // ── Selectors ──────────────────────────────────────────────────────────────
    const displayName         = usePortalStore(selectDisplayName);
    const displayRole         = usePortalStore(selectDisplayRole);
    const nikKaryawan         = usePortalStore(selectNikKaryawan);
    const initials            = usePortalStore(selectDisplayInitials);
    const activeTab           = usePortalStore(selectActiveTab);
    const searchQuery         = usePortalStore(selectSearchQuery);
    const allPermissions      = usePortalStore(useShallow(selectAllPermissions));
    const favoritePermissions = usePortalStore(useShallow(selectFavoritePermissions));
    const filteredPermissions = usePortalStore(useShallow(selectFilteredPermissions));
 
    const favoriteCount  = favoritePermissions.length;
    const recentCount    = recentModules.length;
    const isSearchActive = searchQuery.trim().length > 0;
 
    // ── Init ───────────────────────────────────────────────────────────────────
    useEffect(() => {
        initUser();
    }, [initUser]);
 
    // ── Handlers ───────────────────────────────────────────────────────────────
 
    const handleOpenModule = useCallback((defaultUrl: string, moduleId: number) => {
        const isConfigured = hasConfiguredDefaultView(defaultUrl);
 
        _openModule(defaultUrl, {
            router,
            onUnderDevelopment: () => toast.info('Modul masih dalam tahap pengembangan.'),
        });
 
        if (isConfigured) {
            setActiveModule(moduleId);
            recordRecent(moduleId);
        }
    }, [router, setActiveModule, recordRecent]);
 
    const handleToggleFavorite = useCallback((event: React.MouseEvent, moduleId: number, isFavorite: boolean) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (togglingModuleId !== null) return;
        toggleFavorite({ moduleId, isFavorite });
    }, [togglingModuleId, toggleFavorite]);
 
    const handleLogout       = useCallback(() => showLogoutConfirm(), [showLogoutConfirm]);
    const handleCancelLogout = useCallback(() => hideLogoutConfirm(), [hideLogoutConfirm]);
 
    const handleConfirmLogout = useCallback(async () => {
        hideLogoutConfirm();
        try {
            // Logout tetap ke Route Handler dedicated (bukan proxy)
            // karena perlu clearSessionCookies() di server
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) throw new Error('Logout gagal.');
        } catch (err) {
            console.error('Logout gagal:', err);
        } finally {
            clearSession();
            router.replace('/login');
        }
    }, [hideLogoutConfirm, clearSession, router]);
 
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, [setSearchQuery]);
 
    return {
        // Data
        currentUser,
        displayName,
        displayRole,
        nikKaryawan,
        initials,
        activeModuleId,
 
        // Permissions
        allPermissions,
        favoritePermissions,
        filteredPermissions,
        favoriteCount,
        isSearchActive,
 
        // Recent
        recentModules,
        isRecentLoading,
        recentCount,
 
        // UI state
        activeTab,
        searchQuery,
        isLogoutConfirmVisible,
        togglingModuleId,
 
        // Handlers
        setTab,
        handleSearch,
        handleClearSearch,
        handleOpenModule,
        handleToggleFavorite,
        handleLogout,
        handleCancelLogout,
        handleConfirmLogout,
    };
}
