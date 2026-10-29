"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Alert, Button, Input } from "../../common/components";
import { ApiError } from "../../common/http";
import { AuthValidationErrors } from "../domain";
import { useAuth } from "../hooks/useAuth";
import { getSafeRedirect } from "../utils/safeRedirect";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirect(searchParams.get("redirect"));

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<AuthValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errors: AuthValidationErrors = {};

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof AuthValidationErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          const message = err.message || "Credenciales inválidas.";
          setGeneralError(null);
          setFieldErrors({
            email: message,
            password: message,
          });
        } else if (err.statusCode === 400 && err.details) {
          const message = err.message || "Revisa los datos ingresados.";
          const errors: AuthValidationErrors = {};
          if (/correo|email/i.test(message)) errors.email = message;
          if (/contraseña|password/i.test(message)) errors.password = message;
          if (Object.keys(errors).length > 0) {
            setGeneralError(null);
            setFieldErrors(errors);
          } else {
            setGeneralError(message);
          }
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError("Ocurrió un error inesperado al intentar iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
      <div className="text-center mb-6">
        <span className="text-4xl select-none" aria-hidden="true">
          🧊
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
          Iniciar sesión en CUBIX
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ingresa a tu cuenta para gestionar pedidos y catálogo
        </p>
      </div>

      {generalError && (
        <Alert type="error" className="mb-5">
          {generalError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Correo electrónico"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={isLoading}
        />

        <Input
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={isLoading}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Iniciar sesión
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        ¿No tienes una cuenta?{" "}
        <Link
          href={`/registro${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
