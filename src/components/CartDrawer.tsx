import { X, Minus, Plus, Trash2, Wrench, MessageCircle, FileText } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { buildWhatsAppOrder, buildWhatsAppQuote, getWhatsAppUrl } from "@/lib/whatsapp";
import { useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

const formatPrice = (p: number) => "$" + p.toLocaleString("es-CO");

const WHATSAPP_PHONE = "573228947373";

export default function CartDrawer({
  open,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  if (!open) return null;

  const handleSendOrder = () => {
    const message = buildWhatsAppOrder(items);
    const url = getWhatsAppUrl(WHATSAPP_PHONE, message);
    window.open(url, "_blank");
  };

  const handleSendQuote = () => {
    const message = buildWhatsAppQuote(items);
    const url = getWhatsAppUrl(WHATSAPP_PHONE, message);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md h-full bg-card shadow-2xl flex flex-col animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Tu Pedido</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <Wrench className="h-16 w-16" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm">Agrega productos para hacer tu pedido</p>
            </div>
          ) : (
            items.map((item) => {
              const hasImg = item.product.imagen && !imgErrors.has(item.product.id);
              return (
                <div key={item.product.id} className="flex gap-3 bg-muted/50 rounded-xl p-3">
                  {/* Mini image */}
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {hasImg ? (
                      <img
                        src={item.product.imagen}
                        alt={item.product.nombre}
                        className="w-full h-full object-cover"
                        onError={() => setImgErrors((prev) => new Set(prev).add(item.product.id))}
                      />
                    ) : (
                      <Wrench className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info — NO product ID displayed */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.product.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.precio)} c/u
                    </p>
                    <p className="text-base font-extrabold text-primary">
                      {formatPrice(item.product.precio * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg bg-card flex items-center justify-center border border-border"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer — Dual Action Buttons */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">Total:</span>
              <span className="text-2xl font-extrabold text-primary">{formatPrice(totalPrice)}</span>
            </div>

            {/* Button 1: Realizar Pedido */}
            <button
              onClick={handleSendOrder}
              className="w-full h-14 bg-whatsapp text-whatsapp-foreground rounded-xl text-lg font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <MessageCircle className="h-6 w-6" />
              Realizar Pedido
            </button>

            {/* Button 2: Solicitar Cotización */}
            <button
              onClick={handleSendQuote}
              className="w-full h-12 bg-transparent border-2 border-primary text-primary rounded-xl text-base font-bold flex items-center justify-center gap-3 hover:bg-primary/5 active:scale-[0.98] transition-all"
            >
              <FileText className="h-5 w-5" />
              Solicitar Cotización
            </button>

            <button
              onClick={onClear}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-2"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
