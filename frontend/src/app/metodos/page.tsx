import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../site-header";

export const metadata = {
  title: "CUBIX | Métodos de Resolución",
  description:
    "Conoce diferentes métodos para resolver cubos de Rubik: Principiante, CFOP (Fridrich), Roux y ZZ. Aprende sus etapas y notación.",
};

const metodos = [
  {
    id: "principiante",
    nombre: "Método Principiante",
    badge: "Ideal para empezar",
    badgeColor: "bg-emerald-600 text-white",
    etapas: "Capa por capa (Cruz, Esquinas, Central, Última)",
    descripcion:
      "Una forma sencilla de aprender a resolver el cubo capa por capa. Usa algoritmos fáciles de recordar como el conocido Sexy Move (R U R' U') sin necesidad de memorizar fórmulas complejas.",
    imagen: "/images/metodo-principiante.svg",
  },
  {
    id: "cfop",
    nombre: "Método CFOP (Fridrich)",
    badge: "El más usado en Speedcubing",
    badgeColor: "bg-blue-600 text-white",
    etapas: "Cruz (Cross) · F2L · OLL · PLL",
    descripcion:
      "El estándar mundial en torneos de la WCA para 3x3. Desarrollado por Jessica Fridrich, permite reducir el número de pasos resolviendo las dos primeras capas de manera simultánea.",
    imagen: "/images/metodo-cfop.svg",
  },
  {
    id: "roux",
    nombre: "Método Roux",
    badge: "Eficiencia de movimientos",
    badgeColor: "bg-purple-600 text-white",
    etapas: "Bloques 1x2x3 · CMLL · LSE (Capa M)",
    descripcion:
      "Método alternativo ideado por Gilles Roux. Se enfoca en construir dos bloques laterales de 1x2x3 y resolver el resto utilizando giros de la capa media (M), reduciendo drásticamente la cantidad de movimientos.",
    imagen: "/images/metodo-roux.svg",
  },
  {
    id: "zz",
    nombre: "Método ZZ",
    badge: "Sin rotaciones de cubo",
    badgeColor: "bg-amber-500 text-slate-900",
    etapas: "EOLine · ZZF2L · LL",
    descripcion:
      "Inventado por Zbigniew Zborowski. Orienta todas las aristas desde el primer paso (EOLine), permitiendo resolver el resto del cubo usando únicamente giros de <R, U, L> sin tener que rotar el puzzle en las manos.",
    imagen: "/images/metodo-zz.svg",
  },
];

export default function MetodosPage() {
  return (
    <>
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 mb-3">
            🧩 Algoritmos y Notación
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Métodos de Resolución
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Conoce diferentes métodos para resolver cubos de Rubik con sus pasos
            y notaciones, y descubre cuál se adapta mejor a tu forma de aprender
            y practicar.
          </p>
        </section>

        <section aria-label="Listado de métodos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {metodos.map((metodo) => (
              <article
                key={metodo.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 sm:h-64 w-full bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                  <div className="relative w-full h-full">
                    <Image
                      src={metodo.imagen}
                      alt={metodo.nombre}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${metodo.badgeColor}`}
                  >
                    {metodo.badge}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {metodo.nombre}
                    </h2>
                  </div>

                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    Etapas: {metodo.etapas}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {metodo.descripcion}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Ideal para speedcubing
                    </span>
                    <Link
                      href="/tienda"
                      className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition"
                    >
                      Ver cubos recomendados →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          <strong>CUBIX</strong> · Aprende, practica y supera tus marcas · &copy;
          2026
        </p>
      </footer>
    </>
  );
}
