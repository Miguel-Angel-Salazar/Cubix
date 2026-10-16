import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../site-header";

export const metadata = {
  title: "CUBIX | Blog de Speedcubing y Guías",
  description:
    "Artículos, guías y consejos sobre el cubo de Rubik: historia de Ernő Rubik, speedcubing competitivo, consejos para principiantes y cómo bajar tus tiempos.",
};

const articulos = [
  {
    id: "historia-rubik",
    titulo: "Historia del cubo de Rubik",
    categoria: "Historia del cubo",
    fecha: "2026",
    lectura: "4 min de lectura",
    resumen:
      "Conoce cómo nació uno de los rompecabezas más famosos del mundo en 1974 de la mano del arquitecto e inventor Ernő Rubik, y cómo pasó de ser una herramienta didáctica para comprender geometría tridimensional a un fenómeno cultural y deporte mundial.",
    imagen: "/images/historia-rubik.jpg",
  },
  {
    id: "speedcubing",
    titulo: "¿Qué es el speedcubing?",
    categoria: "Competición oficial WCA",
    fecha: "2026",
    lectura: "5 min de lectura",
    resumen:
      "Descubre en qué consiste resolver cubos de Rubik buscando los mejores tiempos posibles. Conoce el reglamento de los torneos oficiales de la World Cube Association (WCA), las categorías reconocidas y la vibrante comunidad internacional.",
    imagen: "/images/speedcubing.jpg",
  },
  {
    id: "consejos-principiantes",
    titulo: "Consejos para principiantes",
    categoria: "Guía de inicio",
    fecha: "2026",
    lectura: "6 min de lectura",
    resumen:
      "Una guía práctica con los pasos fundamentales para iniciarse: conseguir un cubo 3x3 magnético y suave, familiarizarse con la notación internacional (R, L, U, D, F, B), dominar el método capa por capa y desarrollar constancia diaria sin frustrarse.",
    imagen: "/images/consejos.jpg",
  },
  {
    id: "mejorar-tiempos",
    titulo: "Cómo mejorar tus tiempos (Sub-30 y Sub-20)",
    categoria: "Velocidad y técnica",
    fecha: "2026",
    lectura: "7 min de lectura",
    resumen:
      "Estrategias clave para bajar tus marcas personales: utilizar un timer oficial con almohadillas sensibles, entrenar activamente el lookahead para encadenar pares de F2L sin pausas, optimizar fingertricks y mantener lubricado el mecanismo.",
    imagen: "/images/tiempos.jpg",
  },
];

export default function BlogPage() {
  return (
    <>
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 mb-3">
            📰 Artículos y Guías
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Blog CUBIX
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Conoce la historia del cubo de Rubik, aprende conceptos de
            speedcubing y descubre consejos para mejorar tu práctica diaria y
            tus tiempos.
          </p>
        </section>

        <section aria-label="Artículos del blog">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {articulos.map((articulo) => (
              <article
                key={articulo.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={articulo.imagen}
                    alt={articulo.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md bg-blue-600 text-white">
                    {articulo.categoria}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2">
                    <span>{articulo.fecha}</span>
                    <span>•</span>
                    <span>{articulo.lectura}</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {articulo.titulo}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {articulo.resumen}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Comunidad CUBIX
                    </span>
                    <Link
                      href="/tienda"
                      className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition"
                    >
                      Equípate en la tienda →
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
          <strong>CUBIX</strong> · Pasión, técnica y comunidad · &copy; 2026
        </p>
      </footer>
    </>
  );
}
