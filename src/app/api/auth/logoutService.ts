/**
 * Location : src/app/api/logoutService.ts
 *
 * Service layer untuk logout.
 * Mengirim notifikasi ke backend untuk invalidate refresh token
 * secara fire-and-forget — tidak di-await agar logout tetap cepat.
 *
 * Hanya boleh di-import dari Server Component atau Route Handler.
 * 
 */

// ─── Konfigurasi ──────────────────────────────────────────────────────────────
 
const API_BASE_URL = process.env.API_BASE_URL ?? '';
 
// ─── Service ──────────────────────────────────────────────────────────────────
 
/**
 * @fileoverview Service layer untuk logout.
 * @location src/app/api/auth/logoutService.ts
 * @description Mengirim notifikasi ke backend untuk invalidate refresh token
 *              secara fire-and-forget — tidak di-await agar logout tetap cepat.
 *              HANYA boleh di-import dari Server Component atau Route Handler.
 */

/**
 * @description Memberitahu backend untuk invalidate refresh token.
 *              Dipanggil secara fire-and-forget dari Route Handler.
 *              Tidak menggunakan apiClient() agar tidak memicu refresh token
 *              saat logout — token yang expired sekalipun tidak perlu diperbarui
 *              hanya untuk memberitahu backend.
 */

export function notifyBackendLogout(refreshToken: string): void {
    void fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: 'no-store',
    }).catch(() => {
        // Abaikan error — cookie sudah terlanjur dihapus di Route Handler
    });
}