"use client";
 
/**
 * @fileoverview Client Component utama untuk halaman portal.
 * @location app/portal/_components/portalClient.tsx
 * @description Bertanggung jawab untuk merender layout portal, termasuk sidebar, 
 *              header, dan daftar modul. Logika dan state dikelola oleh hook usePortal.
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePortal } from '@/src/hooks/usePortal';
import PortalSidebar from '@/app/portal/_components/portalSidebar';
import ModuleGrid from "@/app/portal/_components/moduleGrid";
import styles from '@/app/portal/page.module.css';

export default function PortalClient() { 
    
    const portal = usePortal();

    return (
        <>
            <section className="min-h-screen flex items-center justify-center p-6 overflow-hidden w-full">
                {/* Decorative blobs */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-40"></div>
                    <div className={["absolute inset-0 opacity-40", styles['bg-dot-pattern']].join(" ")}></div>
                </div>
                {/* App Shell */}
                <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/50 flex min-h-[640px]">
                    {/* Sidebar */}
                    <PortalSidebar
                        displayName={portal.displayName}
                        displayRole={portal.displayRole}
                        displayInitials={portal.initials}
                        nikKaryawan={portal.nikKaryawan}
                        namaKaryawan={portal.namaKaryawan}
                        onLogoutClick={portal.handleLogout}
                    />
                    {/* Main Content */}
                    <main className="flex-1 flex flex-col bg-white overflow-hidden">
                        {/* Module Grid */}
                        <ModuleGrid
                            activeTab={portal.activeTab}
                            searchQuery={portal.searchQuery}
                            activeModule={portal.activeModuleId}
                            togglingModuleId={portal.togglingModuleId}
                            allPermissions={portal.filteredPermissions}
                            favoritePermissions={portal.favoritePermissions}
                            recentModules={portal.recentModules}
                            isRecentLoading={portal.isRecentLoading}
                            onSetTab={portal.setTab}
                            onSearch={portal.handleSearch}
                            onClearSearch={portal.handleClearSearch}
                            onOpenModule={portal.handleOpenModule}
                            onToggleFavorite={portal.handleToggleFavorite}
                        />
                        {/* Bottom Banner */}
                        <div className="px-8 pb-7 animate-fade-up-portal">
                            <div className="rounded-2xl p-5 flex gap-4 relative overflow-hidden bg-linear-to-r from-gray-900 to-blue-950">
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="w-56 shrink-0">
                                    <p className="font-extrabold text-white text-base mb-1">Layanan+</p>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Kami berkomitmen dalam mendampingi <br />
                                        setiap perjalanan Anda menggunakan <br />
                                        aplikasi kami.
                                    </p>
                                </div>
                                <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-xl p-3.5 flex items-center gap-3 cursor-pointer shrink-0 flex-1 border border-white/10">
                                    <span className="text-3xl">📖</span>
                                    <div>
                                        <p className="text-white font-bold text-sm">Panduan</p>
                                        <p className="text-slate-400 text-xs">Informasi lengkap penggunaan aplikasi.</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-xl p-3.5 flex items-center gap-3 cursor-pointer shrink-0 flex-1 border border-white/10">
                                    <span className="text-3xl">🎫</span>
                                    <div>
                                        <p className="text-white font-bold text-sm">Ticketing</p>
                                        <p className="text-slate-400 text-xs">Sampaikan kendala Anda, tim siap membantu.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                </div>

            </section>
            {/* Dialog konfirmasi logout */}
            <AlertDialog open={portal.isLogoutConfirmVisible} onOpenChange={(open) => !open && portal.handleConfirmLogout()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari aplikasi?
                            Sesi Anda akan diakhiri.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={portal.handleCancelLogout}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 cursor-pointer hover:bg-red-700 focus:ring-red-600" onClick={portal.handleConfirmLogout}>
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}