"use client";

/**
 * @fileoverview Grid modul dengan sistem tab dan pencarian.
 * @location app/portal/_components/moduleGrid.tsx
 * @description Menampilkan daftar modul berdasarkan tab (Semua / Favorit / Terbaru).
 *              Data modul yang diterima via props (seperti allPermissions) diasumsikan 
 *              sudah difilter oleh store (selectFilteredPermissions).
 */

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import type { ModulePermission, RecentModule, PortalTab } from '@/src/shared/types/module';
import ModuleCard from '@/app/portal/_components/moduleCard';
import styles from '@/app/portal/page.module.css';

// ─── Props ───────────────────────────────────────────────────────────────────

type ModuleGridProps = {
    activeTab: PortalTab;
    searchQuery: string;
    activeModule: number | null;
    togglingModuleId: number | null;
    /** Sudah difilter oleh store — tidak perlu filter ulang */
    allPermissions:     ModulePermission[];
    favoritePermissions: ModulePermission[];
    recentModules:      RecentModule[];
    isRecentLoading:    boolean;
    onSetTab:           (tab: PortalTab) => void;
    onSearch:           (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch:      () => void;
    onOpenModule:       (defaultUrl: string, moduleId: number) => void;
    onToggleFavorite:   (e: React.MouseEvent, moduleId: number, isFavorite: boolean) => void;
};

interface TabButtonProps {
    label: string;
    isActive: boolean;
    count?: number;
    onClick: () => void;
}

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ label, isActive, count, onClick }: TabButtonProps) { 

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                isActive ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100",
            ].join(" ")}>
                {label}
                {count !== undefined && count > 0 && (
                    <span
                        className={[
                            "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                            isActive ? "bg-white text-blue-500" : "bg-blue-100 text-blue-600",
                        ].join(" ")}>
                        {count}
                    </span>
                )}
        </button>
    )
}

function EmptyState({ icon, title, subtitle }: EmptyStateProps) {

    return (
        <div className="col-span-2 flex flex-col items-center justify-center py-16 text-slate-400">
            {icon}
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs mt-1">{subtitle}</p>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ModuleGrid({
    activeTab,
    searchQuery,
    activeModule,
    togglingModuleId,
    allPermissions,
    favoritePermissions,
    recentModules,
    isRecentLoading,
    onSetTab,
    onSearch,
    onClearSearch,
    onOpenModule,
    onToggleFavorite,
}: ModuleGridProps) {

    const isSearchActive = searchQuery.trim().length > 0;

    return (
        <>
            {/* Header */}
            <div className="px-8 pt-7 pb-0 flex items-center justify-between animate-fade-up-portal">
                <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">
                        Selamat datang
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">
                        Portal Modul
                    </h1>
                </div>
                {/* Search — hanya tampil di tab all */}
                <div className={`relative ${activeTab !== "all" ? "invisible" : ""}`}>
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                    <InputGroup>
                        <InputGroupInput 
                            id="search-modul"
                            type="text"
                            placeholder="Cari modul…"
                            value={searchQuery}
                            onChange={onSearch}
                            className={[
                                "pl-9 py-2.5 text-smtext-slate-700",
                                "placeholder-slate-400 w-56 transition-all",
                                isSearchActive ? "pr-8" : "pr-4",
                            ].join(" ")} />
                            {isSearchActive && (
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton 
                                        type="button"
                                        onClick={onClearSearch}
                                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        aria-label="Hapus pencarian">
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                            </svg>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            )}
                    </InputGroup>
                </div>
            </div>
            {/* Tabs */}
            <div className="px-8 pt-4 flex gap-1">
                <TabButton label="Semua Modul" isActive={activeTab === "all"} onClick={() => onSetTab("all")} />
                <TabButton label="Favorit" isActive={activeTab === "favorite"} count={favoritePermissions.length} onClick={() => onSetTab("favorite")} />
                <TabButton label="Terbaru" isActive={activeTab === "recent"} count={recentModules.length} onClick={() => onSetTab("recent")} />
            </div>
            {/* Grids */}
            <div className={["flex-1 overflow-y-auto px-8 pt-4 pb-4", styles['scrollbar-hide']].join(" ")}>

                {/* all modules */}
                {activeTab === "all" && (
                    <div className="grid grid-cols-2 gap-3">
                        {allPermissions.length > 0 ? (
                            allPermissions.map((permission) => (
                                <ModuleCard
                                    key={permission.kode_module}
                                    permission={permission}
                                    isActive={activeModule === permission.id}
                                    isTogglingFavorite={togglingModuleId === permission.id}
                                    onOpen={onOpenModule}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-3 opacity-40">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                }
                                title={isSearchActive ? "Modul tidak ditemukan" : "Tidak ada modul tersedia"}
                                subtitle={isSearchActive ? "Coba kata kunci lain." : "Hubungi administrator untuk mendapatkan akses."}/>
                        )}
                    </div>
                )}

                {/* favorite modules */}
                {activeTab === "favorite" && (
                    <div className="grid grid-cols-2 gap-3">
                        {favoritePermissions.length > 0 ? (
                            favoritePermissions.map((permission) => (
                                <ModuleCard
                                    key={permission.kode_module}
                                    permission={permission}
                                    isActive={activeModule === permission.id}
                                    isTogglingFavorite={togglingModuleId === permission.id}
                                    onOpen={onOpenModule}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-3 opacity-40">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                }
                                title="Belum ada favorit"
                                subtitle="Klik ikon bintang pada modul untuk menambahkan ke favorit."
                            />
                        )}
                    </div>
                )}

                {/* recent modules */}
                {activeTab === "recent" && (
                    isRecentLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <svg className="size-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {recentModules.length > 0 ? (
                                recentModules.map((recent) => (
                                    <ModuleCard
                                        key={recent.kode_module}
                                        permission={recent}
                                        isActive={activeModule === recent.id}
                                        isTogglingFavorite={false}
                                        onOpen={onOpenModule}
                                        onToggleFavorite={() => {}}
                                        showFavorite={false}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-3 opacity-40">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }
                                    title="Belum ada riwayat"
                                    subtitle="Modul yang pernah dibuka akan muncul di sini."
                                />
                            )}
                        </div>
                    )
                )}

            </div>

        </>
    )

}
