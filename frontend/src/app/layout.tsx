import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CUBIX | El mundo del cubo",
  description:
    "Aprende sobre cubos de Rubik, métodos de resolución y speedcubing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {children}
        <Script id="theme-preference" strategy="beforeInteractive">
          {`document.documentElement.dataset.theme = localStorage.getItem("tema") === "oscuro" ? "dark" : "light";`}
        </Script>
      </body>
    </html>
  );
}
