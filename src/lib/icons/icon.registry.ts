/**
 * @fileoverview Registry seluruh ikon SVG yang digunakan aplikasi.
 * @location src/lib/icons/icon.registry.ts
 * @description Menyimpan definisi ikon dalam satu peta terpusat agar komponen
 *              ikon bisa melakukan lookup berdasarkan nama. Tambahkan ikon baru
 *              di bagian bawah file dengan format yang sama.
 */
 
export interface IconDefinition {
    viewBox: string;
    attrs?: Record<string, string | number>;
    content: string;
}
 
export const ICON_REGISTRY = {
 
    'check-circle-solid': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>`,
    },
 
    'icon-table': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />`,
    },
 
    'icon-square': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        content: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />`,
    },
 
    'icon-building': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />`,
    },
 
    'icon-vehicle': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        content: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />`,
    },
 
    'icon-tool': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />`,
    },
 
    'icon-asset': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        content: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 15a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /><path d="M7 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14.218 17.975l6.619 -12.174" /><path d="M6.079 9.756l12.217 -6.631" /><path d="M7 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />`,
    },
 
    'icon-gear': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`,
    },
 
    'icon-database': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />`,
    },
 
    'icon-computer-dekstop': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />`,
    },
 
    'icon-square-stack': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />`,
    },
 
    'icon-bars-4': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />`,
    },
 
    'icon-user-plus': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />`,
    },
 
    'icon-list-refresh': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />`,
    },
 
    'icon-list-search': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />`,
    },
 
    'icon-list-edit': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />`,
    },
 
    'icon-list-delete': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />`,
    },
 
    'icon-form-save': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`,
    },
 
    'icon-form-close': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />`,
    },
 
    'icon-chevron-left': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`,
    },
 
    'icon-chevron-right': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 3 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`,
    },
 
    'icon-chevron-down': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`,
    },
 
    'icon-user-minus': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />`,
    },
 
    'icon-spin-loading': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>`,
    },
 
    // Icon fallback — digunakan otomatis jika nama icon tidak ditemukan di registry
    '__fallback__': {
        viewBox: '0 0 24 24',
        attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        content: `<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />`,
    },
 
    // Tambahkan icon baru di bawah ini mengikuti format yang sama:
    // 'nama-icon': {
    //   viewBox: '0 0 24 24',
    //   attrs: { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    //   content: `<path .../>`,
    // },
 
} satisfies Record<string, IconDefinition>;
 
export type IconName = keyof typeof ICON_REGISTRY;
 
export function isValidIconName(name: string): name is IconName {
    return name in ICON_REGISTRY;
}
