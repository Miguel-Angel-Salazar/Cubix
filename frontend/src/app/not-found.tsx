import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md mx-auto">
        <span className="text-8xl select-none block mb-6" aria-hidden="true">
          🧊
        </span>

        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          404
        </h1>

        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          Esta página no existe
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Parece que esta ruta se mezcló como un cubo sin resolver.
          Vuelve al inicio y sigue explorando el mundo del cubo de Rubik.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
