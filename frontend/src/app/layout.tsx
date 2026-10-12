import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CUBIX | El mundo del cubo",
  description:
    "Aprende sobre cubos de Rubik, métodos de resolución y speedcubing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50">{children}</body>
    </html>
  );
}
