/**
 * @fileoverview Halaman login.
 * @location app/login/page.tsx
 */

import DashboardPreview from "./_components/dashboardPreview";
import LoginForm from "./_components/loginForm";

export const metadata = {
    title: "Sign in to ESAKU",
    description: "Secure ESAKU Access",
};

export default async function LoginPage() {

  return (
    <main className="min-h-screen mesh-bg flex items-center justify-center p-4 lg:p-0 overflow-hidden">
      {/* bg blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-24 w-[600px] h-[600px] rounded-full bg-violet-100/40 blur-3xl"></div>
      </div>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20">
        <LoginForm />
        <DashboardPreview />
      </div>
    </main>
  );
  
}