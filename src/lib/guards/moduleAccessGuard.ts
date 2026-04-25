/**
 * @fileoverview Helper guard untuk validasi izin akses modul pada Route Handlers.
 * @location src/lib/guards/moduleAccessGuard.ts
 * @description Memastikan user memiliki izin read pada modul tertentu.
 *              Semua data dibaca dari cookie (tanpa fetch ke backend).
 * 
 * @example
 *   export async function GET(request: NextRequest) {
 *     const guard = moduleAccessGuard(request, 'INV');
 *     if (guard) return guard; // Mengembalikan 401/403 jika tidak ada akses
 *
 *     // Lanjut logika handler...
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/lib/auth/getCurrentUser';
import { SESSION_COOKIE_NAME, ACTIVE_MODULE_COOKIE_NAME } from '@/src/app/services/authService'; 

export function moduleAccessGuard(
    request: NextRequest,
    requiredModuleCode?: string
): NextResponse | null { 

    if (!requiredModuleCode) {
        return null;
    }

    // Cek login — sama seperti authGuard
    const accessToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!accessToken) {
        return NextResponse.json(
            { message: 'Unauthorized. Silakan login terlebih dahulu.' },
            { status: 401 }
        );
    }

    // Baca data user + permissions dari cookie 'user'
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
        return NextResponse.json(
            { message: 'Unauthorized. Data sesi tidak ditemukan.' },
            { status: 401 }
        );
    }

    // Cek permission modul
    const permission = currentUser.permissions.find(
        (item) => item.kode_module === requiredModuleCode
    );

    if (!permission || !permission.can_read) {
        return NextResponse.json(
            { message: 'Anda tidak punya izin untuk mengakses modul tersebut.' },
            { status: 403 }
        );
    }

    // Cek active module dari cookie
    const activeModule = request.cookies.get(ACTIVE_MODULE_COOKIE_NAME)?.value;

    if (!activeModule) {
        return NextResponse.json(
            { message: 'Silakan pilih modul terlebih dahulu sebelum mengakses menu atau form.' },
            { status: 403 }
        );
    }

    if (activeModule !== String(permission.id)) {
        return NextResponse.json(
            { message: 'Modul aktif tidak sesuai. Silakan pilih modul dari portal.' },
            { status: 403 }
        );
    }

    return null;

}