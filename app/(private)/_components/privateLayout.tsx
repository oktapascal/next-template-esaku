"use client";
 
/**
 * @fileoverview Komponen shell layout untuk halaman private.
 * @location app/(private)/_components/privateLayout.tsx
 * @description Pengganti Angular PrivateLayoutComponent.
 *              Komponen ini hanya berisi JSX — semua logika ada di usePrivateLayout.
 *
 *              Struktur:
 *              ┌─────────────────────────────────────────────┐
 *              │  <aside> Sidebar                            │
 *              │    Logo | Nav (SidebarMenuItem rekursif)    │
 *              ├─────────────────────────────────────────────┤
 *              │  <header> Topbar                            │
 *              │    Hamburger | Breadcrumbs | Actions        │
 *              ├─────────────────────────────────────────────┤
 *              │  <main> {children}                          │
 *              └─────────────────────────────────────────────┘
 */

import Link from 'next/link';
import {
    Menu,
    ExternalLink,
    LayoutGrid,
    Bell,
    ChevronDown,
    ChevronRight,
    LogOut,
    User,
    Settings,
    Lock,
    ListTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Icon from '@/src/lib/icons/icon';
import { usePrivateLayout } from '@/app/(private)/_hooks/usePrivateLayout';
import { SidebarMenuItem } from '@/app/(private)/_components/sidebarMenuItem';

// ─── Dropdown panel style ─────────────────────────────────────────────────────
 
function dropdownStyle(open: boolean): React.CSSProperties {
    return {
        opacity:       open ? 1 : 0,
        transform:     open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
        visibility:    open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition:    'opacity 150ms ease, transform 150ms ease',
    };
}

// ─── Component ────────────────────────────────────────────────────────────────
 
export function PrivateLayout({ children }: { children: React.ReactNode }) { 

    const {
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
    } = usePrivateLayout();  
    
    return (
        <div className="flex h-full overflow-hidden bg-warm-100">
            {/* ══════════════════════════════════════════════ SIDEBAR ══════════════════════════════════════════════ */}
            <aside className={cn('sidebar-bar relative flex w-64 shrink-0 flex-col bg-white', 'shadow-[2px_0_12px_color-mix(in_srgb,var(--color-warm-900)_7%,transparent)]', 'transition-all duration-300', !isSidebarOpen && 'sidebar-collapsed')}>
                {/* Logo */}
                <Link href="#" className="relative z-10 flex h-[60px] shrink-0 items-center gap-2.5 border-b border-warm-200 px-5 no-underline">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-display text-[13px] font-black text-white shadow-[0_2px_8px_color-mix(in_srgb,var(--color-brand-700)_35%,transparent)]">
                        SAI
                    </div>
                    <span className="font-display text-base font-bold tracking-wide text-warm-900">
                        ESAKU
                    </span>
                </Link>
                {/* Navigation */}
                 <nav className="sidebar-scroll relative z-10 flex-1 overflow-y-auto py-4">
                    {/* Loading */}
                    {isMenuLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Icon name="icon-spin-loading" className="size-5 animate-spin text-warm-400" />
                        </div>
                    )}
                    {/* Empty state */}
                    {!isMenuLoading && menuItems.length === 0 && (
                        <div className="mx-3 mt-4 rounded-xl border border-warm-200 bg-warm-50 px-4 py-5 text-center">
                            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-warm-100">
                                <ListTree className="size-5 text-warm-400" />
                            </div>
                            <p className="text-[12px] font-semibold text-warm-700">Menu tidak tersedia</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-warm-400">
                                Tidak ada menu yang dapat ditampilkan untuk modul ini.
                            </p>
                        </div>
                    )}
                    {/* Menu items — diurutkan berdasarkan field index dari API */}
                    {!isMenuLoading && menuItems.length > 0 &&
                        [...menuItems].sort((a, b) => a.index - b.index).map((item) => (
                            <SidebarMenuItem key={item.id} item={item} depth={0} />
                        ))
                    }

                 </nav>

            </aside>

            {/* ══════════════════════════════════════════════ MAIN ══════════════════════════════════════════════ */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* ── Topbar ── */}
                <header className="animate-fade-slide-up relative z-10 flex h-[60px] shrink-0 items-center gap-4 border-b border-warm-200 bg-white px-6 shadow-sm">
                    {/* LEFT: Hamburger + Breadcrumbs */}
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={toggleSidebar} aria-expanded={isSidebarOpen} className="flex size-9 items-center justify-center rounded-md text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-900">
                            <Menu className="size-[18px]" />
                        </button>
                        <div className="h-5 w-px bg-warm-200" />
                        <nav className="flex items-center gap-1.5 text-[13px]">
                            {breadcrumbs.map((crumb, i) => {
                                const isLast = i === breadcrumbs.length - 1;
                                return (
                                    <span key={i} className="flex items-center gap-1.5">
                                        <span className={cn(isLast ? 'font-semibold text-warm-900' : 'font-medium text-warm-300')}>
                                            {crumb}
                                        </span>
                                        {!isLast && <ChevronRight className="size-3 text-warm-300/50" />}
                                    </span>
                                );
                            })}
                        </nav>
                    </div>
                    {/* RIGHT: Action buttons */}
                    <div className="ml-auto flex items-center gap-1.5" data-user-dropdown>
                        {/* Buka tab baru */}
                        <button type="button" title="Buka di tab baru" onClick={openNewTab} className="flex size-9 items-center justify-center rounded-md border border-warm-200 bg-white text-warm-600 transition-all hover:bg-warm-100 hover:text-warm-900">
                            <ExternalLink className="size-[18px]" />
                        </button>
                        {/* ── Module Switcher ── */}
                        <div className="relative" data-user-dropdown>
                            <button type="button" title="Ganti modul" onClick={toggleModuleSwitcher} aria-expanded={isModuleSwitcherOpen} className={cn('flex size-9 items-center justify-center rounded-md border border-warm-200 bg-white text-warm-600 transition-all hover:bg-warm-100 hover:text-warm-900', isModuleSwitcherOpen && 'bg-warm-100 text-warm-900')}>
                                <LayoutGrid className="size-[18px]" />
                            </button>
                            {/* Panel */}
                            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-lg" style={dropdownStyle(isModuleSwitcherOpen)}>
                                <div className="border-b border-warm-200 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-warm-400">Modul</p>
                                </div>
                                <div className="max-h-72 overflow-y-auto py-1.5">
                                    {permissions.map((permission) => (
                                        <button key={permission.id} type="button" onClick={() => switchModule(permission.default_url, permission.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-warm-50">
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-warm-100">
                                                <Icon name={permission.icon_module} className="size-4 text-warm-600" />
                                            </div>
                                            <span className="flex-1 truncate text-[13px] font-medium text-warm-800">
                                                {permission.nama_module}
                                            </span>
                                            {activeModuleId === permission.id && (
                                                <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                                                Aktif
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-warm-200 p-2">
                                    <Link href="/portal" className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-semibold text-warm-600 no-underline transition-colors hover:bg-warm-50 hover:text-warm-900">
                                        Lihat Semua Modul
                                        <ChevronRight className="size-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Notifikasi */}
                        <button type="button" className="relative flex size-9 items-center justify-center rounded-md border border-warm-200 bg-white text-warm-600 transition-all hover:bg-warm-100 hover:text-warm-900">
                            <Bell className="size-[18px]" />
                            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[8px] font-bold text-white">
                                3
                            </span>
                        </button>
                        {/* ── User Dropdown ── */}
                        <div className="relative ml-1" data-user-dropdown>
                            <button type="button" onClick={toggleUserMenu} aria-expanded={isUserMenuOpen} className="flex cursor-pointer items-center gap-2 rounded-md border border-warm-200 bg-white py-1 pl-1 pr-2.5 transition-all hover:bg-warm-100">
                                <div className="flex size-7 items-center justify-center rounded-md bg-linear-to-br from-brand-700 to-brand-900 text-[11px] font-bold text-white">
                                    {displayInitials}
                                </div>
                                <span className="text-[13px] font-semibold text-warm-900">{displayName}</span>
                                <ChevronDown className={cn('size-3.5 text-warm-300 transition-transform duration-200', isUserMenuOpen && 'rotate-180')}/>
                            </button>
                            {/* Panel */}
                            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-lg" style={dropdownStyle(isUserMenuOpen)}>
                                {/* Profile header */}
                                <div className="flex items-center gap-3 border-b border-warm-200 px-4 py-3.5">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-700 to-brand-900 text-sm font-bold text-white">
                                        {displayInitials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold text-warm-900">{displayName}</p>
                                        <p className="text-[11px] text-warm-600">{currentUser?.username ?? ''}</p>
                                    </div>
                                </div>
                                {/* Menu items */}
                                <div className="py-1.5">
                                    {[
                                        { label: 'Profil Saya',     href: '#', ItemIcon: User },
                                        { label: 'Pengaturan Akun', href: '#', ItemIcon: Settings },
                                        { label: 'Notifikasi',       href: '#', ItemIcon: Bell, badge: 3 },
                                        { label: 'Ubah Password',   href: '#', ItemIcon: Lock },
                                    ].map(({ label, href, ItemIcon, badge }) => (
                                        <Link key={label} href={href} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-warm-700 no-underline transition-colors hover:bg-warm-100">
                                            <ItemIcon className="size-4 text-warm-300" />
                                            {label}
                                            {badge !== undefined && (
                                                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
                                                    {badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                                {/* Logout */}
                                <div className="border-t border-warm-200 py-1.5">
                                    <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-brand-700 transition-colors hover:bg-brand-50">
                                        <LogOut className="size-4" />
                                        Keluar
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                </header>
                {/* Content */}
                <main className="flex-1 overflow-y-auto p-7">{children}</main>

            </div>
            {/* Dialog konfirmasi logout */}
            <AlertDialog open={isLogoutConfirmVisible} onOpenChange={(open) => !open && cancelLogout()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari akun ini? Sesi Anda akan diakhiri.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={cancelLogout}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 cursor-pointer hover:bg-red-700 focus:ring-red-600" onClick={confirmLogout}>
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )

}