/**
 * @fileoverview HTTP client internal untuk Route Handlers Next.js.
 * @location src/lib/apiClient.ts
 * @description Berjalan HANYA di server (Route Handler / Server Action).
 *              Browser tidak pernah melihat token — token hanya hidup di server.
 *              Setara dengan HttpInterceptorFn Angular:
 *              - Baca access_token dari cookie request masuk
 *              - Tambahkan Authorization header ke request backend
 *              - Jika 401 → refresh token → retry sekali
 *              - Jika refresh gagal → hapus cookie → kembalikan 401 ke browser
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, USER_COOKIE_NAME, ACTIVE_MODULE_COOKIE_NAME } from "@/src/app/services/authService";

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    throw new Error('[api-client] Environment variable API_BASE_URL is not set');
}
 
type FetchArgs = Parameters<typeof fetch>;

type RefreshResult =
    | { ok: true; accessToken: string }
    | { ok: false };

type RefreshPayload = {
    code: number;
    status: string;
    data?: {
        access_token?: string;
        access_token_expired?: number;
        refresh_token?: string;
        refresh_token_expired?: number;
        token_type?: string;
    };
};

let refreshPromise: Promise<RefreshResult> | null = null;

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------
export const COOKIE_OPTIONS = {
    httpOnly: true,      // tidak bisa diakses JavaScript browser
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari — sesuaikan dengan expiry token di backend
} satisfies Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2];

export async function clearSessionCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete(ACTIVE_MODULE_COOKIE_NAME);
}

// ---------------------------------------------------------------------------
// Helper: buat NextResponse dari response backend (untuk proxy handler)
// Sebelumnya: backendResponse.text() → binary data rusak saat di-encode ulang
// ---------------------------------------------------------------------------
export async function proxyResponse(backendResponse: Response): Promise<NextResponse> {
    const body = await backendResponse.arrayBuffer();
 
    // Teruskan Content-Type asli dari backend, bukan hardcode 'application/json'
    const contentType = backendResponse.headers.get('Content-Type') ?? 'application/json';
 
    return new NextResponse(body, {
        status: backendResponse.status,
        headers: { 'Content-Type': contentType },
    });
}

// ---------------------------------------------------------------------------
// Refresh token
// ---------------------------------------------------------------------------
async function attemptRefresh(): Promise<RefreshResult> {
    // Jika sudah ada refresh yang berjalan, tunggu hasilnya
    if (refreshPromise) return refreshPromise;
 
    refreshPromise = _doRefresh().finally(() => {
        refreshPromise = null;
    });
 
    return refreshPromise;
}

async function _doRefresh(): Promise<RefreshResult> {
 
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
 
    if (!refreshToken) return { ok: false };
 
    try {
        const requestBodies = [
            { refresh_token: refreshToken },
            { refreshToken },
        ];

        for (const body of requestBodies) {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Kompatibilitas: beberapa backend membaca refresh token dari Authorization header.
                    'Authorization': `Bearer ${refreshToken}`,
                },
                body: JSON.stringify(body),
                cache: 'no-store',
            });

            if (!response.ok) {
                // Log diagnostik agar akar masalah refresh bisa terdeteksi dari status endpoint.
                console.warn('[api-client] Refresh endpoint returned non-OK status:', response.status);
                continue;
            }

            let payload: RefreshPayload | null = null;
            try {
                payload = await response.json() as RefreshPayload;
            } catch {
                payload = null;
            }

            const accessToken = payload?.data?.access_token;
            const nextRefreshToken = payload?.data?.refresh_token;

            if (!accessToken) {
                continue;
            }

            // Update cookie dengan token baru
            cookieStore.set(SESSION_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
            if (nextRefreshToken) {
                cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, nextRefreshToken, COOKIE_OPTIONS);
            }

            return { ok: true, accessToken };
        }

        return { ok: false };
 
    } catch (error) {
        // [FIX 3] Log error — sebelumnya error ditelan diam-diam
        console.error('[api-client] Token refresh failed:', error);
        return { ok: false };
    }
 
}

// ---------------------------------------------------------------------------
// Core: fetch ke backend dengan Authorization header otomatis
// ---------------------------------------------------------------------------
export async function apiClient(
    path: string,
    init: FetchArgs[1] = {},
    hasRetried = false,
    retryAccessToken?: string,
): Promise<Response> {
 
    const cookieStore = await cookies();
    const accessToken = retryAccessToken ?? cookieStore.get(SESSION_COOKIE_NAME)?.value;
 
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            // Authorization selalu didahulukan agar tidak bisa ditimpa caller
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
            // Caller bebas override Content-Type (misal: multipart/form-data)
            ...(init as RequestInit).headers,
        },
    });
 
    // Bukan 401 atau sudah retry → kembalikan langsung
    if (response.status !== 401 || hasRetried) {
        return response;
    }
 
    // Coba refresh token (dengan dedupe)
    const refreshed = await attemptRefresh();
 
    if (!refreshed.ok) {
        // Refresh gagal → hapus semua cookie sesi
        await clearSessionCookies();
        return response; // kembalikan 401 asli ke browser
    }
 
    // Retry request asli dengan token baru
    return apiClient(path, init, true, refreshed.accessToken);
 
}
