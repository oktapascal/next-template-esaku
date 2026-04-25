"use client";

/**
 * @fileoverview Sidebar portal untuk navigasi dan informasi user.
 * @location app/portal/_components/portalSidebar.tsx
 * @description Menampilkan profile card, informasi karyawan, dan tombol logout.
 */

import styles from '@/app/portal/page.module.css';

type SidebarInfo = {
    displayName: string;
    displayRole: string;
    displayInitials: string;
    nikKaryawan: string;
};

type PortalSidebarProps = SidebarInfo & {
    onLogoutClick: () => void; // Hanya membuka dialog, bukan langsung logout
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-700">{value}</p>
        </div>
    );
}

export default function PortalSidebar({ displayName, displayRole, displayInitials, nikKaryawan, onLogoutClick }: PortalSidebarProps) { 
    
    return (
        <aside className={["w-64 shrink-0 flex flex-col p-6 relative overflow-hidden animate-slide-in-portal", styles['glass-sidebar']].join(" ")}>
            {/* subtle inner gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-blue-50/60 to-transparent pointer-events-none"></div>
            {/* Profile Card */}
            <div className="relative z-10 flex flex-col items-center text-center mb-8">
                <div className={[styles['avatar-ring'], "mb-1"].join(" ")}>
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white tracking-wide">
                            {displayInitials}
                        </span>
                    </div>
                </div>
                <span className="mt-3 text-lg font-bold text-slate-800">{displayName}</span>
                <span className="mt-1 text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700 tracking-wide">
                    ● Aktif
                </span>
                <button
                    type="button"
                    className="cursor-pointer mt-3 w-full text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl py-2 px-4">
                        Perbarui Layanan
                </button>
            </div>
            {/* Info Karyawan */}
            <div className="relative z-10 space-y-4 flex-1">
                <div className={["rounded-2xl p-4 space-y-3", styles['glass-card']].join(" ")}>
                    <InfoRow label="NIK" value={nikKaryawan} />
                    <div className="w-full h-px bg-slate-100"></div>
                    <InfoRow label="Jabatan" value={displayRole} />
                </div>
            </div>
            {/* Logout */}
            <button
                type="button"
                onClick={onLogoutClick}
                className="relative z-10 mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors group cursor-pointer">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="3"
                            stroke="currentColor"
                            className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"/>
                        </svg>
                    </span>
                    Keluar
            </button>
        </aside>
    )

}