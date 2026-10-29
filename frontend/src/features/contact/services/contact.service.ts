export interface ContactMessage {
  nombre: string;
  correo: string;
  mensaje: string;
}

export async function submitContactMessage(message: ContactMessage): Promise<void> {
  const response = await fetch("https://formspree.io/f/mqaejnbk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error("No fue posible enviar el mensaje. Inténtalo de nuevo.");
  }
}