import { PrismaClient, ProductCategory, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    slug: "cubo-2x2-qiyi-qidi",
    name: "Cubo 2x2 QiYi Qidi",
    category: ProductCategory.CUBOS,
    priceCop: 24000,
    imageUrl: "/images/cubo-2x2.jpg",
    description:
      "Cubo pequeño y ligero, ideal para comenzar a practicar y aprender algoritmos básicos.",
  },
  {
    slug: "cubo-3x3-moyu-rs3m-v5",
    name: "Cubo 3x3 MoYu RS3M V5",
    category: ProductCategory.CUBOS,
    priceCop: 45000,
    imageUrl: "/images/cubo-3x3.jpg",
    description:
      "El cubo clásico de velocidad con posicionamiento magnético y excelente corte de esquinas.",
  },
  {
    slug: "cubo-4x4-meilong-m",
    name: "Cubo 4x4 MeiLong M",
    category: ProductCategory.CUBOS,
    priceCop: 52000,
    imageUrl: "/images/cubo-4x4.jpg",
    description:
      "Una opción para quienes buscan un reto mayor sin centros fijos y con imanes de fábrica.",
  },
  {
    slug: "cubo-5x5-meilong",
    name: "Cubo 5x5 MeiLong",
    category: ProductCategory.CUBOS,
    priceCop: 65000,
    imageUrl: "/images/cubo-5x5.jpg",
    description:
      "Cubo de 5 capas suave y compacto para aumentar la dificultad y la concentración.",
  },
  {
    slug: "pyraminx-magnetico-qiyi",
    name: "Pyraminx Magnético QiYi",
    category: ProductCategory.PUZZLES,
    priceCop: 38000,
    imageUrl: "/images/pyraminx.jpg",
    description:
      "Puzzle con forma de pirámide que ofrece una experiencia de resolución rápida y diferente.",
  },
  {
    slug: "megaminx-qiheng",
    name: "Megaminx QiHeng",
    category: ProductCategory.PUZZLES,
    priceCop: 55000,
    imageUrl: "/images/megaminx.jpg",
    description:
      "Un puzzle de 12 caras multicolores que representa un gran reto para amantes de los cubos.",
  },
  {
    slug: "cubo-3x3-gan-356-m",
    name: "Cubo 3x3 GAN 356 M",
    category: ProductCategory.CUBOS,
    priceCop: 120000,
    imageUrl: "/images/hero-cube.jpg",
    description:
      "Cubo magnético de alta gama con peso ultra liviano y giro profesional para speedcubers.",
  },
  {
    slug: "lubricante-moyu-lube-v1-10ml",
    name: "Lubricante MoYu Lube V1 10ml",
    category: ProductCategory.ACCESORIOS,
    priceCop: 18000,
    imageUrl: "/images/lubricante.jpg",
    description:
      "Lubricante oficial de silicona marca MoYu para suavizar giros y alargar la vida útil del cubo.",
  },
  {
    slug: "timer-digital-stackmat",
    name: "Timer digital de velocidad StackMat",
    category: ProductCategory.ACCESORIOS,
    priceCop: 68000,
    imageUrl: "/images/timer.jpg",
    description:
      "Cronómetro de competición con almohadillas táctiles para registrar tus marcas oficiales.",
  },
];

async function main() {
  console.info("Iniciando seed de CUBIX...");

  // 1. Crear o actualizar usuarios de prueba
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cubix.com" },
    update: {
      name: "Administrador CUBIX",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@cubix.com",
      name: "Administrador CUBIX",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@cubix.com" },
    update: {
      name: "Usuario CUBIX",
      role: Role.USER,
      passwordHash: userPasswordHash,
    },
    create: {
      email: "user@cubix.com",
      name: "Usuario CUBIX",
      role: Role.USER,
      passwordHash: userPasswordHash,
    },
  });

  console.info(`Usuarios creados/actualizados: ${admin.email} (ADMIN), ${user.email} (USER)`);

  // 2. Crear o actualizar catálogo de productos reales de la Entrega 1
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.info(`Seed completado: ${products.length} productos y 2 usuarios de prueba.`);
}

main()
  .catch((error: unknown) => {
    console.error("No se pudo completar el seed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
