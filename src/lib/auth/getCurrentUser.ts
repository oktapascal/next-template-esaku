/**
 * 
 * @description Helper untuk membaca data user dari cookie 'user' yang di-set saat login.
 * @location src/lib/auth/getCurrentUser.ts
 * 
 * Helper untuk membaca data user dari cookie 'user' yang di-set saat login.
 *
 * Tidak ada fetch ke backend — murni baca cookie, seperti Laravel auth session.
 * Cookie 'user' berisi JSON dari data user + permissions.
 * Cookie 'user' bukan HttpOnly agar frontend (React) bisa membacanya untuk kebutuhan UI.
 * 
 * Mendukung dua konteks:
 * - Route Handler   : terima NextRequest     → getCurrentUser(request)
 * - Server Component: terima ReadonlyRequestCookies dari cookies() → getCurrentUser(cookieStore)
 * 
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { USER_COOKIE_NAME } from '@/src/app/services/authService';

interface Permission {
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
 
interface Role {
    id: number;
    name: string;
}
 
interface Karyawan {
    id: number;
    nik_karyawan: string;
    nama_karyawan: string;
}
 
export interface CurrentUser {
    id: number;
    username: string;
    role: Role;
    karyawan: Karyawan;
    permissions: Permission[];
}

// Inferensi tipe langsung dari return value cookies() — lebih aman daripada import
// dari path internal next/dist/... yang bisa berubah sewaktu-waktu saat upgrade Next.js.
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>;

type CookieSource = NextRequest | ReadonlyRequestCookies;

function getCookieValue(source: CookieSource, name: string): string | undefined {

    // NextRequest — punya property .cookies
    if ('cookies' in source && typeof (source as NextRequest).cookies?.get === 'function') {
        return (source as NextRequest).cookies.get(name)?.value;
    }
    // ReadonlyRequestCookies dari next/headers
    return (source as ReadonlyRequestCookies).get(name)?.value;

}

export function getCurrentUser(source: CookieSource): CurrentUser | null {

    const userCookie = getCookieValue(source, USER_COOKIE_NAME);
    if (!userCookie) return null;

    try {
        return JSON.parse(decodeURIComponent(userCookie)) as CurrentUser;
    } catch {
        return null;
    }

}