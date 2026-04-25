"use client";

/**
 * @fileoverview Component untuk form login.
 * @location app/login/_components/loginForm.tsx
 * @description Component ini HANYA berkomunikasi dengan /api/auth/login
 *              (Route Handler lokal), tidak pernah langsung ke backend eksternal.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

// ─── Konfigurasi ──────────────────────────────────────────────────────────────

const ERROR_ALERT_TIMEOUT_MS = 3000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginCredentials {
  username: string;
  password: string;
}
 
interface LoginApiResponse  {
  user: unknown;
}
 
interface ApiErrorResponse {
  message?: string;
}

type Inputs = {
    username: string;
    password: string;
}

// ─── Client-side API caller ───────────────────────────────────────────────────
// Hanya memanggil Route Handler Next.js (/api/auth/login), bukan backend langsung.
async function callLoginApi(credentials: LoginCredentials) {

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    console.log(response);

    if (!response.ok) {
        // .catch(() => ({})) disengaja — antisipasi non-JSON dari proxy/CDN
        const error: ApiErrorResponse = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "Login gagal. Periksa username dan password Anda.");
    }
    
    return response.json() as Promise<LoginApiResponse>;

}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginForm() { 

    const router = useRouter();
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState, reset } = useForm<Inputs>({
        defaultValues: {
            username: "",
            password: "",
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async ({ username, password }) => {

        if (!username.trim() || !password.trim()) {
            toast.error("Username dan password tidak boleh kosong.");
            return;
        }

        try {

            await callLoginApi({ username: username.trim(), password });

            // Validasi redirect param untuk mencegah open redirect attack.
            // "//evil.com" dimulai dengan "/" tapi bukan path lokal — harus ditolak.
            const raw = searchParams.get("redirect") ?? "";
            const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/portal";
            
            // Gunakan replace agar halaman login tidak masuk history —
            // sama seperti perilaku Laravel Auth::attempt() + redirect()->intended()
            router.replace(redirectTo);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
            toast.error(message, { duration: ERROR_ALERT_TIMEOUT_MS });

            // reset form fields
            reset();
        }

    } 

    return (
        <div className="w-full lg:w-[440px] xl:w-[460px] shrink-0 card-glass p-8 xl:p-10 flex flex-col justify-center">

            {/* logo */}
            <div className="mb-8 flex items-center gap-2.5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-end gap-0.5">
                    <div className="w-4 h-9 bg-red-500 rounded-sm" style={{ clipPath: "polygon(20% 0%,100% 0%,80% 100%,0% 100%)" }}></div>
                    <div className="w-4 h-9 bg-red-600 rounded-sm" style={{ clipPath: "polygon(0% 0%,80% 0%,100% 100%,20% 100%)" }}></div>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">ESAKU</span>
            </div>

            {/* heading */}
            <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    Sign in to ESAKU
                </h1>
                <p className="text-sm text-gray-500">Access your dashboard and manage everything.</p>
            </div>

            {/* demo notice */}
            <div className="mb-5 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <Info className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                    Use <strong>demo</strong> username and <strong>saisai</strong> for demo access.
                </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldGroup className="gap-0">

                    <Controller
                        name="username"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="mb-4 animate-fade-up" style={{ animationDelay: "0.4s" }} data-invalid={fieldState.invalid}>
                                <FieldLabel className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="username">Username</FieldLabel>
                                <Input {...field} id="username" type="text" aria-invalid={fieldState.invalid} placeholder="Masukkan username..." autoComplete="off" />
                            </Field>
                        )} />

                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="mb-4 animate-fade-up" style={{ animationDelay: "0.5s" }} data-invalid={fieldState.invalid}>
                                <FieldLabel className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">Password</FieldLabel>
                                <InputGroup className="relative">
                                    <InputGroupInput {...field} id="password" type={showPassword ? "text" : "password"} aria-invalid={fieldState.invalid} placeholder="Masukkan password..." autoComplete="off" />
                                    <InputGroupButton className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </InputGroupButton>
                                </InputGroup>
                            </Field>
                        )} />
                    
                </FieldGroup>

                {/* button login */}
                <Field className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
                    <Button className="btn-continue w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" type="submit" variant="default" disabled={formState.isLoading}>
                        {formState.isLoading ? "Loading..." : "Lanjutkan"}
                    </Button>
                </Field>

            </form>

            {/* copyright */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">© 2026 ESAKU. All rights reserved.</p>
            </div>

        </div>
    )

}