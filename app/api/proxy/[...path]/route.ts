/**
 * @fileoverview Proxy handler untuk Route Handlers Next.js.
 * @location app/api/proxy/[...path]/route.ts
 * @description Forward semua request dari browser ke backend API.
 *              Token ditangani otomatis oleh apiClient (baca cookie, inject header,
 *              refresh jika 401).
 *              Browser hanya berkomunikasi dengan Next.js, tidak pernah langsung ke backend API.
 *
 * @example
 *   fetch('/api/proxy/users/me')          → forward ke {API_BASE_URL}/users/me
 *   fetch('/api/proxy/products', {...})   → forward ke {API_BASE_URL}/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiClient, proxyResponse } from '@/src/lib/apiClient';

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

// Method yang mungkin membawa body request
const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH', 'DELETE'];

async function handler(request: NextRequest, context: RouteContext): Promise<NextResponse> {

    const { path } = await context.params;
    const backendPath = '/' + path.join('/');

    // Teruskan query string jika ada
    const search = request.nextUrl.search;
    const fullPath = `${backendPath}${search}`;

    // Teruskan body — termasuk DELETE karena beberapa backend menggunakannya
    let body: string | undefined;
    if (METHODS_WITH_BODY.includes(request.method)) {
        body = await request.text();
    }

    // Teruskan headers relevan dari browser
    // Authorization TIDAK diteruskan — ditangani oleh apiClient dari cookie
    const forwardedHeaders: Record<string, string> = {};
    const allowedHeaders = ['content-type', 'accept', 'accept-language'];
    request.headers.forEach((value, key) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
            forwardedHeaders[key] = value;
        }
    });

    const backendResponse = await apiClient(fullPath, {
        method: request.method,
        headers: forwardedHeaders,
        body,
    });

    return proxyResponse(backendResponse);

}

export const GET    = handler;
export const POST   = handler;
export const PUT    = handler;
export const PATCH  = handler;
export const DELETE = handler;