/**
 * @fileoverview Definisi tipe data untuk modul dan izin akses.
 * @location src/shared/types/module.ts
 * @description Menyediakan interface untuk struktur data modul yang memiliki 
 *              izin akses (permissions) terkait user.
 */

export interface ModulePermission {
    id: number;
    kode_module: string;
    nama_module: string;
    icon_module: string;
    default_url: string;
    can_read: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    is_favorite: boolean;
}
 
/** Tipe modul terbaru — struktur sama dengan ModulePermission */
export type RecentModule = ModulePermission;
export type FavoriteModule = ModulePermission;
export type Module = ModulePermission;
export type PortalTab = "all" | "favorite" | "recent";
