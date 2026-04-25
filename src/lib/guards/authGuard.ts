/**
 * @fileoverview Helper guard untuk memvalidasi status login user pada Route Handlers.
 * @location src/lib/guards/authGuard.ts
 * @description Memeriksa keberadaan cookie 'access_token' (setara dengan auth middleware Laravel).
 *              Digunakan untuk memproteksi endpoint API secara individual.
 * 
 * @example
 *   export async function GET(request: NextRequest) {
 *     const guard = authGuard(request);
 *     if (guard) return guard; // Mengembalikan 401 jika tidak terautentikasi
 *
 *     // Lanjut logika handler...
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/src/app/services/authService'; 

export function authGuard(request: NextRequest): NextResponse | null {
  const accessToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
 
  if (!accessToken) {
    return NextResponse.json(
      { message: 'Unauthorized. Silakan login terlebih dahulu.' },
      { status: 401 }
    );
  }
 
  return null;
}