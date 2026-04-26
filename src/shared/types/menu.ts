/**
 * @fileoverview Tipe data untuk item menu sidebar.
 * @location src/shared/types/menu.ts
 * @description Struktur sesuai response API /modules/{module_id}/menus
 */
 
export interface MenuItem {
  id: number;
  index: number;
  nama_menu: string;
  icon_menu: string;
  path_url: string | null;
  menus: MenuItem[];        // children rekursif
}
 
/** Response wrapper dari endpoint menu — berbeda dari ApiResponse generic */
export interface MenuApiResponse {
  code: number;
  status: string;
  data: MenuItem[];
}