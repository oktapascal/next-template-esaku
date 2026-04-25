/**
 * @fileoverview Route Handler untuk autentikasi login.
 * @location app/api/auth/login/route.ts
 * @description Menerima kredensial dari browser, forward ke backend via loginService,
 *              lalu simpan token di cookie HttpOnly.
 *              Browser tidak pernah melihat access_token maupun refresh_token.
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_OPTIONS } from '@/src/lib/apiClient';
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from "@/src/app/services/authService";
import { loginService, isLoginServiceError, type LoginCredentials } from '@/src/app/api/auth/loginService';

export async function POST(request: NextRequest): Promise<NextResponse> { 

    try {
        const body = await request.json() as LoginCredentials;
 
        const result = await loginService(body);

        const data = result.data;

        // Simpan token di cookie HttpOnly — tidak pernah dikirim ke browser
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, data.access_token, COOKIE_OPTIONS);
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token, COOKIE_OPTIONS);
 
        // Data user + permissions — bukan HttpOnly agar frontend bisa baca untuk kebutuhan UI,
        // tapi guard di server juga membacanya dari sini (tanpa fetch ke backend lagi)
        cookieStore.set(USER_COOKIE_NAME, encodeURIComponent(JSON.stringify(data.user)), {
            ...COOKIE_OPTIONS,
            httpOnly: false,
        });
 
        // Kembalikan hanya data user ke browser, bukan token
        return NextResponse.json({ user: data.user });
    } catch (error) {
        console.error('Error logging in:', error);
 
        if (isLoginServiceError(error)) {
            // Relay body error dari backend (misal pesan validasi) apa adanya
            return NextResponse.json(error.body, { status: error.statusCode });
        }
 
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 }); 
    }

}
