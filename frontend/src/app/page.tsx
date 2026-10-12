import Image from "next/image";

const topics = [
  {
    title: "Cubos",
    description:
      "Conoce cubos clásicos, puzzles y opciones para dar tus primeros pasos.",
  },
  {
    title: "Métodos",
    description:
      "Explora distintas formas de resolver un cubo y mejorar tu técnica.",
  },
  {
    title: "Tienda",
    description:
      "Encuentra cubos y accesorios para acompañar tu práctica.",
  },
];

export default function Home() {
  return (
    <>
      <header className="bg-slate-900 text-slate-50">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        >
          <a
            href="#inicio"
            className="text-2xl font-extrabold tracking-wide"
            aria-label="CUBIX, inicio"
          >
            CUBIX<span className="text-amber-400">.</span>
          </a>
          <p className="hidden text-sm text-slate-300 sm:block">
            El mundo del cubo de Rubik
          </p>
        </nav>
      </header>

      <main>
        <section
          id="inicio"
          className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-24 lg:grid-cols-2"
        >
          <div>
            <p className="mb-4 font-semibold text-blue-700">
              Aprende · Practica · Mejora
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Descubre el mundo del cubo
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Aprende sobre cubos de Rubik, descubre diferentes métodos de
              resolución y encuentra productos para mejorar tus tiempos y tu
              experiencia al armarlos.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-xl">
            <Image
              src="/images/hero-cube.jpg"
              alt="Cubo de Rubik 3x3"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <section
          id="explorar"
          aria-labelledby="explorar-titulo"
          className="bg-white px-6 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="explorar-titulo"
              className="text-3xl font-bold tracking-tight text-slate-950"
            >
              ¿Qué encontrarás en CUBIX?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Información para quienes están aprendiendo a armar su primer cubo
              o quieren mejorar su velocidad en speedcubing.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900">
                    {topic.title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {topic.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
