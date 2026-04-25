

/**
 * @fileoverview Middleware untuk autentikasi dan proteksi route.
 * @location src/middleware.ts
 * @description Memeriksa status autentikasi user berdasarkan cookie. 
 *              Mengalihkan user yang sudah login dari halaman publik ke portal, 
 *              dan mengalihkan user yang belum login dari halaman terproteksi ke halaman login.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSessionCookieValid } from '@/src/app/services/authCookies';
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from '@/src/app/services/authService';

const PUBLIC_PATHS = [
    '/login',
    '/register',
];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

/**
 * @description Fungsi middleware utama untuk memproses setiap request yang masuk.
 *              Menangani logika redirect untuk halaman publik/privat dan 
 *              memberikan respon 401 untuk request API yang tidak terautentikasi.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    const accessCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const refreshCookie = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
    const sessionCookie = accessCookie ?? refreshCookie;
    const hasAccessToken = Boolean(accessCookie);
    const hasRefreshToken = Boolean(refreshCookie);
    const hasUserCookie = request.cookies.has(USER_COOKIE_NAME);
    const isAuthenticated = await isSessionCookieValid(sessionCookie);

    // Log untuk debugging
    console.log('Middleware check:', { 
        pathname, 
        hasAccessToken,
        hasRefreshToken,
        hasUserCookie,
        sessionCookieName: SESSION_COOKIE_NAME,
        sessionCookieValid: isAuthenticated,
        allCookies: request.cookies.getAll().map(c => c.name)
    });

    // Jika user sudah login lalu mengakses halaman guest, arahkan ke portal.
    if (isPublicPath(pathname) && isAuthenticated) {
        const portalUrl = request.nextUrl.clone();
        portalUrl.pathname = '/portal';
        portalUrl.search = '';
        return NextResponse.redirect(portalUrl);
    }

    // Halaman guest tetap bisa diakses jika belum login.
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Route selain guest wajib punya cookie auth.
    if (!isAuthenticated) {
        // API routes → return 401, bukan redirect HTML
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Page routes → redirect ke login
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
