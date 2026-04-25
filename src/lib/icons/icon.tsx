/**
 * Location: src/lib/icons/Icon.tsx
 *
 * Komponen icon SVG — pengganti <app-icon> Angular.
 * Render SVG dari ICON_REGISTRY berdasarkan nama string.
 * Bisa dipakai di Server Component maupun Client Component.
 *
 * Cara pakai:
 *   <Icon name="icon-gear" className="size-5 text-slate-600" />
 *   <Icon name="icon-gear" size={20} />
 *   <Icon name="icon-gear" className="size-5" size={20} />
 */

import { ICON_REGISTRY, isValidIconName } from './icon.registry';

type IconProps = {
  /** Nama icon sesuai ICON_REGISTRY */
  name: string;
  /** Class Tailwind untuk ukuran dan warna — contoh: "size-5 text-slate-600" */
  className?: string;
  /** Ukuran eksplisit width/height dalam pixel (opsional, bisa pakai className saja) */
  size?: number;
};

export default function Icon({ name, className, size }: IconProps) { 

    // Ambil definisi icon dari registry, fallback jika tidak ditemukan
  const def = isValidIconName(name)
    ? ICON_REGISTRY[name]
    : (() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Icon] Icon "${name}" tidak ditemukan di registry, menampilkan fallback.`);
        }

        return ICON_REGISTRY['__fallback__'];
    })();
 
    // Bangun atribut SVG dari registry
    const registryAttrs = def.attrs ?? {};

     return (
        <svg
        viewBox={def.viewBox}
        aria-hidden="true"
        {...registryAttrs}
        // width/height dari prop size — override registry jika ada
        {...(size ? { width: size, height: size } : {})}
        // className untuk Tailwind (size-*, text-*, dll) — selalu di akhir agar tidak tertimpa
        className={className}
        // Inject SVG path content
        dangerouslySetInnerHTML={{ __html: def.content }}/>
    );

}