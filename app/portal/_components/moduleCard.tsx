"use client";

/**
 * @fileoverview Komponen kartu modul individual.
 * @location app/portal/_components/moduleCard.tsx
 * @description Menampilkan informasi modul tunggal dalam grid. 
 *              Digunakan di berbagai tab (Semua, Favorit, Terbaru) dan 
 *              menangani aksi navigasi serta toggle favorit.
 */

import type { ModulePermission } from "@/src/shared/types/module";
import Icon from '@/src/lib/icons/icon';
import styles from '@/app/portal/page.module.css';

type ModuleCardProps = {
    permission: ModulePermission;
    isActive: boolean;
    isTogglingFavorite: boolean;
    onOpen: (defaultUrl: string, moduleId: number) => void;
    onToggleFavorite: (e: React.MouseEvent, moduleId: number, isFavorite: boolean) => void;
    /** Tampilkan tombol favorit — disembunyikan di tab Terbaru */
    showFavorite?: boolean;
};

export default function ModuleCard({ permission, isActive, isTogglingFavorite, onOpen, onToggleFavorite, showFavorite = true }: ModuleCardProps) { 
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen(permission.default_url, permission.id)}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(permission.default_url, permission.id)}
            className={[
                "rounded-2xl p-4 flex items-center gap-3 cursor-pointer animate-fade-up-portal w-full text-left",
                styles['module-row'],
                styles['glass-card'],
                isActive ? "active" : "",
            ].filter(Boolean).join(" ")}>
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Icon name={permission.icon_module} className="w-5 h-5 text-blue-600" />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
                <p className="module-title font-semibold text-sm text-slate-800 leading-tight truncate">
                    {permission.nama_module}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{permission.kode_module}</p>
            </div>

            {/* Tombol Favorit */}
            {showFavorite && (
                <button
                    type="button"
                    onClick={(e) => onToggleFavorite(e, permission.id, permission.is_favorite)}
                    disabled={isTogglingFavorite}
                    className={[
                    "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    permission.is_favorite ? "text-yellow-400" : "text-slate-300",
                    isTogglingFavorite ? "opacity-50 pointer-events-none" : "",
                    ].filter(Boolean).join(" ")}
                    aria-label={permission.is_favorite ? "Hapus dari favorit" : "Tambah ke favorit"}>
                    <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill={permission.is_favorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                    </svg>
                </button>
            )}

            {/* Badge check aktif */}
            <div className={["items-center justify-center w-6 h-6 rounded-full bg-blue-500 shrink-0 mr-1", styles['module-badge']].join(" ")}>
                 <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white">
                    <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"/>
                </svg>
            </div>

            {/* Badge status */}
            {isActive ? (
                <span className={[styles['btn-active'], "text-white text-xs font-semibold px-4 py-2 rounded-xl shrink-0"].join(" ")}>
                    Aktif
                </span>
            ) : (
                <span className={[styles['btn-buka'], "text-white text-xs font-semibold px-4 py-2 rounded-xl shrink-0"].join(" ")}>
                    Buka
                </span>
            )}
        </div>
    )
}
