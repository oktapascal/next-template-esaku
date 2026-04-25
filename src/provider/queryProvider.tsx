"use client";

/**
 * @fileoverview Wrapper QueryClientProvider untuk Tanstack Query.
 * @location src/provider/queryProvider.tsx
 * @description Menyediakan konfigurasi QueryClient dengan default options
 *              termasuk staleTime dan retry. Harus dibungkus di app/providers.tsx.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );
 
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}