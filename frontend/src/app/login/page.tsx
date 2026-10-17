"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import SiteHeader from "../site-header";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Cargando formulario...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            <strong>CUBIX</strong> · El mundo del cubo de Rubik
          </p>
        </div>
      </footer>
    </>
  );
}
