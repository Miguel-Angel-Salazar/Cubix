import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../site-header";

export const metadata = {
  title: "CUBIX | Guía de Cubos y Puzzles",
  description:
    "Guía completa de tipos de cubos de Rubik: 2x2, 3x3, 4x4, 5x5, Pyraminx y Megaminx. Encuentra el puzzle ideal para tu nivel.",
};

const cubos = [
  {
    id: "2x2",
    nombre: "Cubo 2x2 (Pocket Cube)",
    badge: "Principiante",
    badgeColor: "bg-blue-600 text-white",
    dificultad: "Fácil",
    descripcion:
      "Formado únicamente por 8 esquinas. Es rápido de resolver, ideal para quienes se inician en la memorización de algoritmos como Ortega o CLL.",
    imagen: "/images/cubo-2x2.jpg",
  },
  {
    id: "3x3",
    nombre: "Cubo 3x3 (El Clásico)",
    badge: "Estándar WCA",
    badgeColor: "bg-amber-500 text-slate-900",
    dificultad: "Media",
    descripcion:
      "El pilar central del speedcubing mundial. Cuenta con más de 43 trillones de combinaciones posibles y es la categoría reina en cualquier torneo oficial.",
    imagen: "/images/cubo-3x3.jpg",
  },
  {
    id: "4x4",
    nombre: "Cubo 4x4 (Rubik's Revenge)",
    badge: "Avanzado",
    badgeColor: "bg-purple-600 text-white",
    dificultad: "Media-Alta",
    descripcion:
      "Al no tener centros fijos, introduce la necesidad de emparejar aristas y resolver centros, además de enfrentarse a las famosas paridades OLL y PLL.",
    imagen: "/images/cubo-4x4.jpg",
  },
  {
    id: "5x5",
    nombre: "Cubo 5x5 (Professor Cube)",
    badge: "Reto Mayor",
    badgeColor: "bg-rose-600 text-white",
    dificultad: "Alta",
    descripcion:
      "El hermano mayor de los cubos estándar. Recupera los centros fijos pero amplía considerablemente la cantidad de bloques a emparejar y el tiempo de concentración.",
    imagen: "/images/cubo-5x5.jpg",
  },
  {
    id: "pyraminx",
    nombre: "Pyraminx",
    badge: "Piramidal",
    badgeColor: "bg-emerald-600 text-white",
    dificultad: "Media",
    descripcion:
      "Un tetraedro de 4 caras triangulares inventado por Uwe Mèffert. Sus giros intuitivos y giros rápidos lo convierten en una de las categorías más divertidas y veloces.",
    imagen: "/images/pyraminx.jpg",
  },
  {
    id: "megaminx",
    nombre: "Megaminx",
    badge: "Dodecaedro",
    badgeColor: "bg-indigo-600 text-white",
    dificultad: "Alta",
    descripcion:
      "Puzzle de 12 caras y 50 piezas móviles. Utiliza una lógica similar al 3x3 pero expandida a una estrella de cinco puntas con un desafío visual incomparable.",
    imagen: "/images/megaminx.jpg",
  },
];

export default function CubosPage() {
  return (
    <>
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 mb-3">
            🧊 Categorías WCA
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Tipos de Cubos y Puzzles
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Explora las principales categorías oficiales de la World Cube
            Association (WCA). Conoce sus características, número de piezas y
            nivel de dificultad para elegir tu siguiente reto.
          </p>
        </section>

        <section aria-label="Listado de cubos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cubos.map((cubo) => (
              <article
                key={cubo.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={cubo.imagen}
                    alt={cubo.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${cubo.badgeColor}`}
                  >
                    {cubo.badge}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {cubo.nombre}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {cubo.descripcion}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Dificultad:{" "}
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {cubo.dificultad}
                      </span>
                    </span>
                    <Link
                      href="/tienda"
                      className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition"
                    >
                      Ver en tienda →
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
          <strong>CUBIX</strong> · Pasión y velocidad en cada giro · &copy; 2026
        </p>
      </footer>
    </>
  );
}
