import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./site-header";

const topics = [
  {
    id: "cubos",
    title: "🧊 Cubos",
    href: "/cubos",
    image: "/images/cubo-3x3.jpg",
    imageAlt: "Cubo de Rubik 3x3",
    description:
      "Conoce diferentes tipos de cubos y descubre cuál se adapta mejor a lo que buscas.",
  },
  {
    id: "metodos",
    title: "🧩 Métodos",
    href: "/metodos",
    image: "/images/metodo-cfop.svg",
    imageAlt: "Diagrama del método de resolución CFOP",
    description:
      "Aprende distintas formas de resolver el cubo y encuentra la que mejor se adapta a ti.",
  },
  {
    id: "tienda",
    title: "🛍️ Tienda",
    href: "/tienda",
    image: "/images/timer.jpg",
    imageAlt: "Timer digital para practicar speedcubing",
    description:
      "Encuentra cubos y accesorios para mejorar tus tiempos y tu experiencia.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="home-main">
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="hero-badge">Aprende · Practica · Mejora</span>
            <h1 id="hero-title" className="hero-title">
              Descubre el mundo del cubo
            </h1>
            <p className="hero-description">
              Aprende sobre cubos de Rubik, descubre diferentes métodos de
              resolución y encuentra productos para mejorar tus tiempos y tu
              experiencia al armarlos.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/cubos">
                Explorar cubos
              </Link>
              <Link className="button button-secondary" href="/metodos">
                Ver métodos
              </Link>
            </div>
          </div>

          <div className="hero-image-frame">
            <Image
              src="/images/hero-cube.jpg"
              alt="Cubo de Rubik 3x3 profesional"
              fill
              priority
              sizes="(max-width: 700px) 100vw, (max-width: 1240px) 50vw, 600px"
              className="hero-image"
            />
          </div>
        </section>

        <section
          id="explorar"
          className="topics-section"
          aria-labelledby="topics-title"
        >
          <h2 id="topics-title" className="section-heading">
            ¿Qué encontrarás en CUBIX?
          </h2>
          <p className="section-description">
            Información organizada para quienes están aprendiendo a armar su
            primer cubo o quieren mejorar su velocidad en speedcubing.
          </p>

          <div className="topic-grid">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                id={topic.id}
                href={topic.href}
                className="topic-card block group"
              >
                <div className="topic-image-frame">
                  <Image
                    src={topic.image}
                    alt={topic.imageAlt}
                    fill
                    sizes="(max-width: 700px) 85vw, (max-width: 900px) 40vw, 350px"
                    className="topic-image"
                  />
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            <strong>CUBIX</strong> · El mundo del cubo de Rubik · &copy; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
