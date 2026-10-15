"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SiteHeader from "../site-header";
import { RegisterForm } from "../../features/auth/components/RegisterForm";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function RegisterPage() {
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
        <RegisterForm />
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
