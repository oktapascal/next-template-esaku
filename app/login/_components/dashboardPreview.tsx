/**
 * @fileoverview Component untuk menampilkan preview dashboard.
 * @location app/login/_components/dashboardPreview.tsx
 */

import Image from "next/image";

const connections = [
  { id: 1, name: "Tyler Hero", sub: "6 connections", img: "https://i.pravatar.cc/32?img=1", connected: false },
  { id: 2, name: "Esther Howard", sub: "23 connections", img: "https://i.pravatar.cc/32?img=5", connected: true },
  { id: 3, name: "Cody Fisher", sub: "34 connections", img: "https://i.pravatar.cc/32?img=8", connected: false },
  { id: 4, name: "Arlene McCoy", sub: "1 connection", img: "https://i.pravatar.cc/32?img=9", connected: true },
];

const integrations = [
  { name: "Google web.dev", email: "webdev@webdevmail.com", active: true, icon: <GoogleIcon /> },
  { name: "Equacoin", email: "equacoin@cryptoproemail.com", active: false, icon: <StarIcon /> },
  { name: "Evernote", email: "evernote@notesexample.com", active: true, icon: <CheckCircleIcon /> },
  { name: "Inferno", email: "inferno@dataexample.com", active: true, icon: <PlusCircleIcon /> },
];

const avatars = [
  "https://i.pravatar.cc/32?img=1",
  "https://i.pravatar.cc/32?img=5",
  "https://i.pravatar.cc/32?img=8",
  "https://i.pravatar.cc/32?img=15",
];

export default function DashboardPreview() {
    return (
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* decoration */}
            <div className="absolute inset-0 grid-pattern"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col justify-center px-10 xl:px-14 py-12 w-full">
                {/* hero text */}
                <div className="mb-10 animate-slide-right" style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-end gap-0.5 mb-5">
                        <div className="w-5 h-10 bg-red-500 rounded-sm" style={{ clipPath: "polygon(20% 0%,100% 0%,80% 100%,0% 100%)" }}></div>
                        <div className="w-5 h-10 bg-red-600 rounded-sm" style={{ clipPath: "polygon(0% 0%,80% 0%,100% 100%,20% 100%)" }}></div>
                    </div>
                    <h2 className="text-3xl xl:text-4xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                        Secure Dashboard<br />Access
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                        A robust authentication gateway ensuring secure, efficient user access to the Metronic Dashboard interface.
                    </p>
                </div>

                {/* cards */}
                <div className="grid grid-cols-2 gap-4">
                    {/* connections */}
                    <div className="feature-card rounded-2xl p-4 animate-float" style={{ animationDelay: "0s" }}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-800">Connections</span>
                            <button className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                <DotsIcon />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            {connections.map((c) => (
                                <div className="integration-item flex items-center gap-2.5 rounded-lg p-1.5" key={c.id}>
                                    <Image
                                        src={c.img}
                                        alt={c.name}
                                        width={28}
                                        height={28}
                                        className="rounded-full object-cover ring-2 ring-white shrink-0"
                                        unoptimized
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                                        <p className="text-[10px] text-gray-400">{c.sub}</p>
                                    </div>
                                    {c.connected ? (
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                            <CheckIcon />
                                        </div>
                                    ) : (
                                        <button className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="mt-3 w-full text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            All Connections
                        </button>

                    </div>
                    {/* theme card */}
                    <div className="feature-card rounded-2xl p-4 animate-float" style={{ animationDelay: "1.5s" }}>
                        
                        <div className="mb-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Appearance</p>
                            <p className="text-sm font-bold text-gray-800">Theme mode</p>
                            <p className="text-[10px] text-gray-400">Choose your preferred theme mode for a more personalized experience.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 mb-3">
                            {/* dark */}
                            <div className="flex flex-col items-center gap-1">

                                <div className="w-full h-10 rounded-lg bg-slate-800 border-2 border-blue-500 relative overflow-hidden">
                                    <div className="absolute inset-0 flex">
                                        <div className="w-1/3 bg-slate-700 h-full"></div>
                                        <div className="flex-1 flex flex-col gap-0.5 p-1">
                                            <div className="h-1 bg-slate-600 rounded-full w-3/4"></div>
                                            <div className="h-1 bg-slate-600 rounded-full w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border border-slate-800 flex items-center justify-center">
                                        <CheckIcon />
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-semibold">Dark</span>

                            </div>
                            {/* light */}
                            <div className="flex flex-col items-center gap-1">

                                <div className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 flex">
                                        <div className="w-1/3 bg-gray-100 h-full"></div>
                                        <div className="flex-1 flex flex-col gap-0.5 p-1">
                                            <div className="h-1 bg-gray-200 rounded-full w-3/4"></div>
                                            <div className="h-1 bg-gray-200 rounded-full w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-semibold">Light</span>

                            </div>
                            {/* system */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-full h-10 rounded-lg bg-linear-to-br from-slate-700 to-gray-200 border border-gray-200"></div>
                                <span className="text-[10px] text-gray-500 font-semibold">System</span>
                            </div>

                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div>
                                <p className="text-[11px] font-bold text-gray-700">Transparent sidebar</p> 
                                <p className="text-[10px] text-gray-400">Toggle for a sleek look</p>
                            </div>
                            <Toggle active={true} />
                        </div>

                    </div>

                    {/* integrations */}
                    <div className="feature-card rounded-2xl p-4 col-span-2 animate-float" style={{ animationDelay: "3s" }}>

                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-800">Integrations</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">6 actives</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            {integrations.map((item) => (
                                <div className="integration-item flex items-center gap-2.5 rounded-lg p-2" key={item.name}>
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{item.email}</p>
                                    </div>
                                    <Toggle active={item.active} />
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

                {/* user count */}
                <div className="mt-6 flex items-center gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
                    <div className="flex">
                        {avatars.map((src, i) => (
                            <div style={{ marginLeft: i === 0 ? 0 : -8 }} key={src}>
                                <Image
                                    src={src}
                                    alt="user"
                                    width={32}
                                    height={32}
                                    className="rounded-full ring-2 ring-slate-800 object-cover"
                                    unoptimized
                                />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full ring-2 ring-slate-800 bg-blue-600 flex items-center justify-center" style={{ marginLeft: -8 }}>
                            <span className="text-white text-[9px] font-bold">49K</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Showing 10 of 49,053 users</p>
                        <p className="text-xs text-gray-400">Active workspace members</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────
function Toggle({ active }: { active: boolean }) {
    return (
        <div className={`flex items-center shrink-0 rounded-full cursor-pointer ${active ? "justify-end bg-blue-500" : "justify-start bg-gray-200"}`} style={{ width: 32, height: 18, padding: 2 }}>
            <div className="bg-white rounded-full shadow" style={{ width: 14, height: 14 }} />
        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}
 
function DotsIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
    );
}
 
function GoogleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}
 
function StarIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
 
function CheckCircleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#16a34a">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    );
}
 
function PlusCircleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    );
}