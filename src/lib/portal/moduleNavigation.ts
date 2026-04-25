/**
 * @fileoverview Utility navigasi modul.
 * @location src/lib/portal/moduleNavigation.ts
 * @description Menyediakan helper untuk menangani navigasi antar modul, 
 *              validasi view default, dan pengecekan status pengembangan modul.
 *              Pengganti Angular ModuleNavigationService.
 */

interface MinimalRouter {
    push: (url: string) => void;
}
 
export interface ModuleNavigationOptions {
    router: MinimalRouter;
    onUnderDevelopment: () => void;
}

/**
 * Daftar path modul yang sudah aktif.
 * Tambahkan entry baru saat modul selesai dikembangkan.
 */
const ACTIVE_MODULE_PATHS: readonly string[] = [
    // tambahkan modul aktif di sini
];

function normalizeUrl(url: string): string {
    return url.split('?')[0].split('#')[0].replace(/^\//, '').toLowerCase().trim();
}

export function hasConfiguredDefaultView(defaultUrl: string): boolean {

    const normalized = normalizeUrl(defaultUrl);
    if (!normalized) return false;

    return ACTIVE_MODULE_PATHS.some((path) => normalized === path || normalized.startsWith(`${path}/`));

}

export function openModule(defaultUrl: string, options: ModuleNavigationOptions): void {

    const { router, onUnderDevelopment } = options;
    
    if (!hasConfiguredDefaultView(defaultUrl)) {
        onUnderDevelopment();
        router.push('/portal');
        return;
    }

    router.push(defaultUrl);
}