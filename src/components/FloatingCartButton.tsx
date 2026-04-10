import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  totalItems: number;
  onClick: () => void;
}

export default function FloatingCartButton({ totalItems, onClick }: FloatingCartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
    >
      <ShoppingCart className="h-7 w-7" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-destructive text-destructive-foreground text-sm font-bold flex items-center justify-center animate-pop-in">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
