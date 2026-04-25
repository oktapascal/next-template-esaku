/**
 * @fileoverview Helper validasi cookie sesi untuk guard di Proxy/Server.
 * @location src/app/services/authCookies.ts
 * @description Memastikan cookie sesi ada dan nilainya bukan string kosong.
 *              Backend bisa memakai token JWT, opaque session id, atau format lain,
 *              sehingga guard di frontend tidak boleh memaksa format JWT.
 */

export async function isSessionCookieValid(sessionCookie: string | undefined): Promise<boolean> {
    return Boolean(sessionCookie?.trim());
}
