"use client";
 
/**
 * @fileoverview Hook logika untuk private layout.
 * @location app/(private)/_hooks/usePrivateLayout.ts
 *
 * Mengikuti pola yang sama dengan usePortal.ts — semua state & handler
 * dipisah dari JSX. Komponen layout hanya mengonsumsi return value hook ini.
 *
 * Sumber data:
 * - usePortalStore  → currentUser, activeModuleId, initUser, setActiveModule, clearSession
 * - selectDisplay*  → selector yang sudah ada (tidak duplikasi logika inisial/nama)
 * - useMenu         → TanStack Query, fetch /api/proxy/modules/{id}/menus
 * - openModule      → dari moduleNavigation.ts (konsisten dengan usePortal)
 * - sonner toast    → konsisten dengan seluruh app
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import {
  usePortalStore,
  selectDisplayName,
  selectDisplayInitials,
  selectActiveModuleId,
  selectAllPermissions,
} from '@/src/store/portalStore';
import { useMenu } from '@/src/hooks/useMenu';
import { openModule, hasConfiguredDefaultView } from '@/src/lib/portal/moduleNavigation';

// ─── Breadcrumb helper ────────────────────────────────────────────────────────
 
function formatBreadcrumb(segment: string): string {
  return segment.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePrivateLayout() {
    const router   = useRouter();
    const pathname = usePathname();

    // ── Store selectors ─────────────────────────────────────────────────────────
    const displayName     = usePortalStore(selectDisplayName);
    const displayInitials = usePortalStore(selectDisplayInitials);
    const activeModuleId  = usePortalStore(selectActiveModuleId);
    const currentUser     = usePortalStore((s) => s.currentUser);
    const setActiveModule = usePortalStore((s) => s.setActiveModule);
    const clearSession    = usePortalStore((s) => s.clearSession);
    const initUser        = usePortalStore((s) => s.initUser);

    // Max 5 permission untuk module switcher — konsisten dengan Angular
    const allPermissions = usePortalStore(useShallow(selectAllPermissions));
    const permissions    = allPermissions.slice(0, 5);

    // ── Init user dari cookie (sekali saat mount) ───────────────────────────────
    useEffect(() => {
        initUser();
    }, [initUser]);

    // ── Menu — TanStack Query, re-fetch otomatis saat activeModuleId berubah ───
    const { data: menuItems = [], isLoading: isMenuLoading } = useMenu();

    // ── Breadcrumbs — derived langsung dari pathname, tidak perlu useEffect ────
    const breadcrumbs = (() => {
        const segments = pathname
            .split('?')[0]
            .split('#')[0]
            .split('/')
            .map((s) => s.trim())
            .filter(Boolean);
        return segments.length === 0 ? ['Overview'] : segments.map(formatBreadcrumb);
    })();

    // ── UI state ────────────────────────────────────────────────────────────────
    const [isSidebarOpen,          setSidebarOpen]          = useState(true);
    const [isUserMenuOpen,         setUserMenuOpen]          = useState(false);
    const [isModuleSwitcherOpen,   setModuleSwitcherOpen]   = useState(false);
    const [isLogoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

    // ── Outside-click: tutup semua dropdown jika klik di luar ──────────────────
    useEffect(() => {
        function onDocumentClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (target.closest('[data-user-dropdown]')) return;
            setUserMenuOpen(false);
            setModuleSwitcherOpen(false);
        }
        document.addEventListener('click', onDocumentClick);
        return () => document.removeEventListener('click', onDocumentClick);
    }, []);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const toggleSidebar = useCallback(
    () => setSidebarOpen((v) => !v),
    [],
    );

    const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((v) => !v);
    setModuleSwitcherOpen(false);
    }, []);

    const toggleModuleSwitcher = useCallback(() => {
    setModuleSwitcherOpen((v) => !v);
    setUserMenuOpen(false);
    }, []);

    const openNewTab = useCallback(() => {
    window.open(window.location.href, '_blank');
    }, []);

    /**
     * Pindah modul — konsisten dengan handleOpenModule di usePortal.ts:
     * 1. Panggil openModule() untuk validasi + navigasi
     * 2. Hanya setActiveModule jika URL valid (terdaftar di ACTIVE_MODULE_PATHS)
     * 3. Query key ['menu', activeModuleId] otomatis berubah → useMenu re-fetch
     */
    const switchModule = useCallback((defaultUrl: string, moduleId: number) => {
    setModuleSwitcherOpen(false);

    openModule(defaultUrl, {
        router,
        onUnderDevelopment: () => toast.info('Modul masih dalam tahap pengembangan.'),
    });

    if (hasConfiguredDefaultView(defaultUrl)) {
        setActiveModule(moduleId);
    }
    }, [router, setActiveModule]);

    const onLogout = useCallback(() => {
    setUserMenuOpen(false);
    setLogoutConfirmVisible(true);
    }, []);

    const cancelLogout = useCallback(() => {
    setLogoutConfirmVisible(false);
    }, []);

    /**
     * Alur logout identik dengan handleConfirmLogout di usePortal.ts —
     * hit /api/auth/logout (Route Handler), clearSession, redirect ke /login.
     */
    const confirmLogout = useCallback(async () => {
    setLogoutConfirmVisible(false);
    
    try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (!res.ok) throw new Error('Logout gagal.');
    } catch (err) {
        console.error('Logout gagal:', err);
    } finally {
        clearSession();
        router.replace('/login');
    }
    }, [clearSession, router]);
 
  // ── Return ──────────────────────────────────────────────────────────────────
    return {
        // User
        displayName,
        displayInitials,
        activeModuleId,
        currentUser,
        permissions,

        // Menu
        menuItems,
        isMenuLoading,

        // Navigation
        breadcrumbs,

        // UI state
        isSidebarOpen,
        isUserMenuOpen,
        isModuleSwitcherOpen,
        isLogoutConfirmVisible,

        // Handlers
        toggleSidebar,
        toggleUserMenu,
        toggleModuleSwitcher,
        openNewTab,
        switchModule,
        onLogout,
        cancelLogout,
        confirmLogout,
    };
}