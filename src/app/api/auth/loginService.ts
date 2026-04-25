/**
 * @fileoverview Service layer untuk autentikasi login.
 * @location src/app/api/auth/loginService.ts
 * @description Mengomunikasikan dengan backend API eksternal,
 *              menangani error, dan mengembalikan data terstruktur.
 *              HANYA boleh di-import dari Server Component atau Route Handler.
 *              TIDAK boleh digunakan langsung oleh Client Component.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
 
export interface LoginCredentials {
    username: string;
    password: string;
}
 
export interface Role {
    id: number;
    name: string;
}
 
export interface Karyawan {
    id: number;
    nik_karyawan: string;
    nama_karyawan: string;
}
 
export interface Permission {
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
 
export interface User {
    id: number;
    username: string;
    role: Role;
    karyawan: Karyawan;
    permissions: Permission[];
}
 
export interface LoginServiceResult {
    code: number;
    status: string;
    data: {
        access_token: string;
        refresh_token: string;
        user: User;
    }
}
 
export interface LoginServiceError {
    message: string;
    statusCode: number;
    /** Raw body dari backend — diteruskan apa adanya ke browser */
    body?: unknown;
}

// ─── Konfigurasi ──────────────────────────────────────────────────────────────
 
const API_BASE_URL = process.env.API_BASE_URL ?? '';

// ─── Helpers ──────────────────────────────────────────────────────────────────
 
/** Buat objek error terstruktur yang bisa dibedakan via isLoginServiceError() */
function makeError(message: string, statusCode: number, body?: unknown): LoginServiceError {
    return { message, statusCode, body };
}

/**
 * Type guard — gunakan di Route Handler untuk membedakan LoginServiceError
 * dari error tak terduga lainnya.
 *
 * @example
 * } catch (err) {
 *   if (isLoginServiceError(err)) {
 *     return NextResponse.json(err.body, { status: err.statusCode });
 *   }
 * }
 */
export function isLoginServiceError(value: unknown): value is LoginServiceError {
    return (typeof value === 'object' && value !== null && 'statusCode' in value && 'message' in value);
}

// ─── Service ──────────────────────────────────────────────────────────────────
 
/**
 * Melakukan POST ke backend `/auth/login` dan mengembalikan token + data user.
 * Jika gagal, melempar objek `LoginServiceError`.
 */
export async function loginService(credentials: LoginCredentials): Promise<LoginServiceResult> {

    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
            cache: 'no-store',
        });
    } catch {
        // fetch() hanya throw saat network error (DNS, timeout, dsb.)
        throw makeError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 503);
    }

    if (!response.ok) {
        let errorBody: unknown = { message: 'Login gagal.' };
        try {
            errorBody = await response.json();
        } catch { /* non-JSON dari nginx/proxy — pakai fallback di atas */ }

        throw makeError('Login gagal.', response.status, errorBody);
    }

    try {
        return (await response.json()) as LoginServiceResult;
    } catch {
        throw makeError('Respons dari server tidak valid.', 502);
    }

}