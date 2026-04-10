import type { CartItem } from "@/lib/types";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-CO");
}

/**
 * Mensaje de PEDIDO — incluye precios y total.
 */
export function buildWhatsAppOrder(items: CartItem[]): string {
  const total = items.reduce((s, i) => s + i.product.precio * i.quantity, 0);
  const lines = items.map(
    (i) => `• [${i.product.id}] ${i.product.nombre} x${i.quantity} — ${formatPrice(i.product.precio * i.quantity)}`
  );
  return [
    `*TIPO DE SOLICITUD:* 🛒 Pedido`,
    `--------------------------`,
    ...lines,
    `--------------------------`,
    `*TOTAL A COBRAR: ${formatPrice(total)}*`,
  ].join("\n");
}

/**
 * Mensaje de COTIZACIÓN — solo lista técnica, sin precios totales.
 */
export function buildWhatsAppQuote(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• [${i.product.id}] ${i.product.nombre} x${i.quantity}`
  );
  return [
    `*TIPO DE SOLICITUD:* 📋 Cotización`,
    `--------------------------`,
    ...lines,
    `--------------------------`,
    `_Por favor envíame la cotización de estos productos._`,
  ].join("\n");
}

export function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
