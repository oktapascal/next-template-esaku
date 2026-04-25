"use client";

/**
 * 
 * @fileoverview Providers root untuk aplikasi Next.js.
 * @location app/providers.tsx
 * @description Memasang QueryProvider untuk konfigurasi React Query
 *              dan Toaster untuk notifikasi toast di seluruh aplikasi.
 * 
 */

import QueryProvider from "@/src/provider/queryProvider";
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            {children}
            <Toaster position="top-right" />
        </QueryProvider>
    );
}