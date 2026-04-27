"use client";
 
/**
 * @fileoverview Komponen item menu sidebar (rekursif).
 * @location app/(private)/_components/sidebarMenuItem.tsx
 * @description Pengganti Angular SidebarMenuItemComponent.
 *              Mendukung nested menu tak terbatas.
 *              Active state via usePathname() — reaktif otomatis saat navigasi.
 *              Icon menggunakan default export dari src/lib/icons/icon.tsx.
 */
 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
 
import Icon from '@/src/lib/icons/icon';
import { MenuItem } from '@/src/shared/types/menu';

// ─── Pure helpers (tidak perlu useCallback karena tidak di dalam komponen) ────
 
function hasActiveChild(menus: MenuItem[], url: string): boolean {
  return menus.some((menu) => {
    if (menu.path_url && url.startsWith(menu.path_url)) return true;
    if (menu.menus.length > 0) return hasActiveChild(menu.menus, url);
    return false;
  });
}
 
function isItemActive(item: MenuItem, url: string): boolean {
  return item.path_url
    ? url.startsWith(item.path_url)
    : hasActiveChild(item.menus, url);
}

// ─── Component ────────────────────────────────────────────────────────────────
 
interface SidebarMenuItemProps {
  item: MenuItem;
  depth?: number;
}

/** Section header — tidak interaktif, tidak butuh hooks */
function MenuLabel({ name }: { name: string }) {
    return (
        <div className="px-5 pb-1 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-warm-400">
                {name}
            </p>
        </div>
    );
}

export function SidebarMenuItem({ item, depth = 0 }: SidebarMenuItemProps) { 

    const pathname    = usePathname();
    const isRootLevel = depth === 0;
    const hasKids     = item.menus.length > 0;
    
    const cleanUrl = pathname.split('?')[0].split('#')[0];
    const active   = isItemActive(item, cleanUrl);
    
    // Auto-open jika item ini atau salah satu child-nya aktif (mirror Angular behavior)
    const [isOpen, setIsOpen] = useState(() => hasKids && active);

    const toggle = () => setIsOpen((v) => !v);

    useEffect(() => {
        if (hasKids && isItemActive(item, cleanUrl) && !isOpen) {
            setIsOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

     // ── Shared styles ───────────────────────────────────────────────────────────
    const navBase = cn(
        'relative mx-2.5 flex w-[calc(100%-20px)] cursor-pointer items-center gap-2.5',
        'rounded-md px-3 py-2.5 text-[13.5px] font-medium text-warm-600',
        'transition-all duration-150 hover:bg-brand-50 hover:text-warm-700',
    );
    
    const activeClass = cn(
        'bg-brand-100 text-brand-700 font-semibold',
        'hover:bg-brand-100 hover:text-brand-700',
    );

    // Estimasi max-height animasi collapse: 44px per item
    const expandedHeight = `${item.menus.length * 44}px`;
    
    const childrenStyle: React.CSSProperties = {
        maxHeight:     isOpen ? expandedHeight : '0px',
        opacity:       isOpen ? 1 : 0,
        transform:     isOpen ? 'translateY(0)' : 'translateY(-4px)',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition:    'max-height 200ms ease-in-out, opacity 200ms, transform 200ms',
    };

    const Chevron = (
        <ChevronDown
            className={cn(
                'size-3.5 shrink-0 text-warm-400 transition-transform duration-200',
                isOpen && 'rotate-180',
            )}
        />
    );

    // ── LABEL — section header, tidak interaktif ───────────────────────────────
    if (item.jenis_menu === 'LABEL') {
        return <MenuLabel name={item.nama_menu} />;
    }

    // ── ROOT LEVEL (depth === 0) ─────────────────────────────────────────────────
    if (isRootLevel) { 
        if (hasKids) { 
            return (
                <div className="mb-1">
                    {/* Toggle button — dengan icon */}
                    <button type="button" onClick={toggle} aria-expanded={isOpen} className={cn(navBase, 'mb-1', active && activeClass)}>
                        <Icon name={item.icon_menu} className="size-5 shrink-0" />
                        <span className="flex-1 text-left">{item.nama_menu}</span>
                        {Chevron}
                    </button>
            
                    {/* Children */}
                    <div className="overflow-hidden" style={childrenStyle}>
                        {item.menus.map((child) => (
                        <SidebarMenuItem key={child.id} item={child} depth={depth + 1} />
                        ))}
                    </div>
                </div>
            );
        }

        // Root leaf — direct link dengan icon
        return (
            <div className="mb-1">
                <Link href={item.path_url ?? '#'} className={cn(navBase, active && activeClass)}>
                    <Icon name={item.icon_menu} className="size-5 shrink-0" />
                    <span className="flex-1">{item.nama_menu}</span>
                </Link>
            </div>
        );
    }

     // ── CHILD LEVEL (depth > 0) — group ──────────────────────────────────────────
     if (hasKids) {
        return (
            <div className="mb-1">
                {/* Toggle button — tanpa icon */}
                <button type="button" onClick={toggle} aria-expanded={isOpen} className={cn(navBase, active && activeClass)}>
                    <span className="flex-1 text-left">{item.nama_menu}</span>
                    {Chevron}
                </button>
        
                {/* Children */}
                <div className="overflow-hidden" style={childrenStyle}>
                    {item.menus.map((child) => (
                        <SidebarMenuItem key={child.id} item={child} depth={depth + 1} />
                    ))}
                </div>
            </div>
        );
    }

    // ── CHILD LEVEL — leaf (sub-menu item dengan dot indicator) ──────────────────
    return (
        <Link href={item.path_url ?? '#'} className={cn('sub-dot relative mx-2.5 flex cursor-pointer items-center rounded-md', 'py-2 pl-11 pr-3 text-[13px] font-normal text-warm-600', 'transition-all duration-150 hover:bg-brand-50 hover:text-warm-700', active && 'sub-dot-active bg-brand-50 font-semibold text-brand-700')}>
            {item.nama_menu}
        </Link>
    );

}