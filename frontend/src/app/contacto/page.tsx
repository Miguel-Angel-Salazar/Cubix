"use client";

import React, { useState } from "react";
import SiteHeader from "../site-header";
import { Alert } from "../../features/common/components";
import { useContact } from "../../features/contact/hooks/useContact";

export default function ContactoPage() {
  const { sendContactMessage } = useContact();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [errors, setErrors] = useState<{
    nombre?: string;
    correo?: string;
    mensaje?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: {
      nombre?: string;
      correo?: string;
      mensaje?: string;
    } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener mínimo 3 caracteres.";
    }

    if (!correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio.";
    } else if (!correo.includes("@") || !correo.includes(".")) {
      newErrors.correo = "Ingresa un correo electrónico válido (ejemplo@correo.com).";
    }

    if (!mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio.";
    } else if (mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener mínimo 10 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setSubmissionError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage({
        nombre: nombre.trim(),
        correo: correo.trim(),
        mensaje: mensaje.trim(),
      });
      setSuccessMessage("¡Mensaje enviado! Nos pondremos en contacto contigo pronto.");
      setNombre("");
      setCorreo("");
      setMensaje("");
      setErrors({});
    } catch (error: unknown) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el mensaje. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 mb-3">
            ✉️ Asesoría y Soporte
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Contáctanos
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            ¿Tienes alguna pregunta, sugerencia o necesitas asesoría sobre qué
            cubo comprar? Escríbenos y con gusto te orientamos.
          </p>
        </section>

        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {successMessage && (
            <div className="mb-6">
              <Alert type="success" title="Mensaje Enviado">
                {successMessage}
              </Alert>
            </div>
          )}
          {submissionError && (
            <div className="mb-6">
              <Alert type="error" title="No se pudo enviar el mensaje">
                {submissionError}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                }}
                placeholder="Escribe tu nombre"
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm transition focus:outline-none focus:ring-2 ${
                  errors.nombre
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) setErrors({ ...errors, correo: undefined });
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm transition focus:outline-none focus:ring-2 ${
                  errors.correo
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.correo && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.correo}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  if (errors.mensaje)
                    setErrors({ ...errors, mensaje: undefined });
                }}
                placeholder="Escribe tu mensaje (mínimo 10 caracteres)..."
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm transition focus:outline-none focus:ring-2 resize-y ${
                  errors.mensaje
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.mensaje && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.mensaje}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enviando mensaje...</span>
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          <strong>CUBIX</strong> · Estamos listos para ayudarte · &copy; 2026
        </p>
      </footer>
    </>
  );
}
