import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import FloatingCartButton from "@/components/FloatingCartButton";
import CartDrawer from "@/components/CartDrawer";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { fuzzyMatch } from "@/lib/fuzzySearch";

export default function Index() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { products, categories, loading } = useProducts("https://docs.google.com/spreadsheets/d/e/2PACX-1vScUHsWzn2rzFJQMHSd_Qz4v5vSq69E0ERGb1z9h4mU4rcdp0OrASIrH1F_5_9rfvOAuN4rrdP-yzHG/pub?gid=0&single=true&output=csv");
  const cart = useCart();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.categoria !== selectedCategory) return false;
      if (search && !fuzzyMatch(`${p.nombre} ${p.categoria}`, search)) return false;
      return true;
    });
  }, [products, search, selectedCategory]);

  const getCartQty = (productId: string) =>
    cart.items.find((i) => i.product.id === productId)?.quantity || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-6xl py-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* Logo — sin cuadros de fondo */}
            <img
              src="/logo.png"
              alt="Logo Estucos y Pinturas"
              className="h-14 w-14 object-contain rounded-xl"
            />

            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                Estucos y Pinturas
              </h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Ferretería y Acabados
              </p>
            </div>
          </div>

          {/* Buscador y Filtros */}
          <div className="space-y-3">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="container max-w-6xl py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-5 bg-muted rounded w-1/2" />
                  <div className="h-12 bg-muted rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Package className="h-16 w-16" />
            <p className="text-xl font-bold">No se encontraron productos</p>
            <p className="text-sm">Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={getCartQty(product.id)}
                onAdd={() => cart.addItem(product)}
                onUpdateQuantity={(qty) => cart.updateQuantity(product.id, qty)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart */}
      <FloatingCartButton totalItems={cart.totalItems} onClick={() => setCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
      />
    </div>
  );
}
