/**
 * @fileoverview Route Handler untuk logout.
 * @location app/api/auth/logout/route.ts
 * @description Menghapus cookie sesi dan opsional memberitahu backend
 *              untuk invalidate refresh token di sisi server.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { clearSessionCookies } from '@/src/lib/apiClient';
import { notifyBackendLogout } from '@/src/app/api/auth/logoutService';
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from "@/src/app/services/authService";

export async function POST(): Promise<NextResponse> {
 
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
 
    // Hapus cookie sesi terlebih dahulu — tidak menunggu backend
    await clearSessionCookies();
 
    // Fire-and-forget: beritahu backend untuk invalidate refresh token
    if (refreshToken) {
        notifyBackendLogout(refreshToken);
    }
 
    return NextResponse.json({ message: 'Logged out' });
}