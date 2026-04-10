import { useState, memo, useCallback } from "react";
import { Plus, Minus, Wrench, Check } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAdd: () => void;
  onUpdateQuantity: (qty: number) => void;
}

function ProductCardInner({ product, cartQuantity, onAdd, onUpdateQuantity }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const hasImage = product.imagen && !imgError;

  const formatPrice = (p: number) => "$" + p.toLocaleString("es-CO");

  const handleAdd = useCallback(() => {
    onAdd();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  }, [onAdd]);

  return (
    <div
      className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col transition-all duration-300 ${
        justAdded ? "animate-cart-bounce ring-2 ring-primary/40" : "animate-pop-in"
      }`}
    >
      {/* Image — ID is NOT displayed */}
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Wrench className="h-12 w-12" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Info — NO product ID shown */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {product.categoria}
        </span>
        <h3 className="text-base font-bold text-foreground mt-1 leading-tight line-clamp-2">
          {product.nombre}
        </h3>
        <p className="text-xl font-extrabold text-primary mt-2">{formatPrice(product.precio)}</p>

        {/* Action */}
        <div className="mt-auto pt-3">
          {cartQuantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full h-12 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 ${
                justAdded
                  ? "bg-green-500 text-white scale-[0.97]"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-5 w-5" />
                  ¡Agregado!
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Añadir al pedido
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-xl h-12 px-1">
              <button
                onClick={() => onUpdateQuantity(cartQuantity - 1)}
                className="h-10 w-10 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-xl font-extrabold text-foreground min-w-[3ch] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(cartQuantity + 1)}
                className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCardInner);
