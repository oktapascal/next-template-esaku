/**
 * @fileoverview Helper guard untuk memastikan request berasal dari user yang BELUM login.
 * @location src/lib/guards/guestGuard.ts
 * @description Berguna untuk endpoint guest-only seperti /api/auth/login atau /api/auth/register.
 *              Mengembalikan 403 Forbidden jika user terdeteksi sudah memiliki sesi.
 * 
 * @example
 *   export async function POST(request: NextRequest) {
 *     const guard = guestGuard(request);
 *     if (guard) return guard; // Mengembalikan 403 jika sudah terautentikasi
 *
 *     // Lanjut logika login...
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/src/app/services/authService'; 

export function guestGuard(request: NextRequest): NextResponse | null {

  const accessToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
 
  if (accessToken) {
    return NextResponse.json(
      { message: 'Forbidden. Anda sudah login.' },
      { status: 403 }
    );
  }
 
  return null;

}