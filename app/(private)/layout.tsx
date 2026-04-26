/**
 * @fileoverview Route group layout untuk halaman private.
 * @location app/(private)/layout.tsx
 * @description Semua halaman di dalam folder (private)/ otomatis
 *              dibungkus layout ini tanpa menambah segment ke URL.
 *
 * Struktur routing:
 *   app/(private)/dashboard/page.tsx  →  /dashboard
 *   app/(private)/master/page.tsx     →  /master
 */

import { PrivateLayout } from '@/app/(private)/_components/privateLayout';
 
export default function Layout({ children }: { children: React.ReactNode }) {
    return <PrivateLayout>{children}</PrivateLayout>;
}