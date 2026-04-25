/**
 * @fileoverview Halaman portal (Server Component).
 * @location app/portal/page.tsx
 * @description Bertanggung jawab sebagai shell halaman portal. 
 *              Melakukan proteksi akses lapis 2 dengan memvalidasi sesi, 
 *              dan menyerahkan interaktivitas serta penyajian data ke PortalClient.
 */

export const metadata = {
    title: 'Portal — ESAKU',
};

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSessionCookieValid } from '@/src/app/services/authCookies';
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/src/app/services/authService';
import PortalClient from '@/app/portal/_components/portalClient';

export default async function Portal() {
    // Lapis 2: validasi sesi berbasis cookie HttpOnly — lapis 1 ada di proxy.ts.
    // Izinkan fallback refresh_token bila access_token belum tersedia/baru expired.
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const refreshCookie = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
    const sessionCookie = accessCookie ?? refreshCookie;
    const isAuthenticated = await isSessionCookieValid(sessionCookie);

    if (!isAuthenticated) {
        redirect('/login');
    }

    // Tidak pass currentUser ke PortalClient —
    // client membacanya sendiri dari cookie via initUser()
    return <PortalClient />;
}