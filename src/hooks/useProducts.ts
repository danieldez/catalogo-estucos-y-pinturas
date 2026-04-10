import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";

const DEMO_CSV = `ID,Nombre,Precio,Categoría,Imagen
001,Cemento Gris 50kg,150000,Construcción,https://images.unsplash.com/photo-1518005068251-37900150dfca?w=300
002,Pala Redonda,45000,Herramientas,https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300
003,Martillo Carpintero,32000,Herramientas,https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300
004,Pintura Blanca 1gal,89000,Pinturas,https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300
005,Tubo PVC 1/2",8500,Plomería,https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300
006,Llave Ajustable 10",28000,Herramientas,https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=300
007,Cinta Métrica 5m,12000,Herramientas,https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300
008,Arena Gruesa m³,95000,Construcción,
009,Tornillos Caja x100,15000,Ferretería,https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300
010,Cable Eléctrico 10m,22000,Eléctrico,https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300
011,Brocha 3 pulgadas,8000,Pinturas,
012,Lija #120 Pliego,2500,Pinturas,
013,Candado 50mm,18000,Ferretería,https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300
014,Manguera Jardín 15m,35000,Jardinería,https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300
015,Silicona Transparente,9500,Ferretería,`;

/**
 * Parsea CSV con columnas: ID, Nombre, Precio, Categoría, Imagen
 * El ID se toma directamente del Excel (no es autoincremental).
 */
function parseCSV(csv: string): Product[] {
  const lines = csv.split("\n");
  const products: Product[] = [];

  // Empezamos en i = 1 para saltarnos los encabezados
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const parts = lines[i].split(",");

    if (parts.length >= 3) {
      products.push({
        id: parts[0]?.trim() || String(i),
        nombre: parts[1]?.trim() || "Producto sin nombre",
        precio: parseInt(parts[2]?.replace(/[^0-9]/g, "") || "0", 10),
        categoria: parts[3]?.trim() || "Varios",
        imagen: parts[4]?.trim() || "",
      });
    }
  }
  return products;
}

export function useProducts(sheetUrl?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        let csv: string;
        if (sheetUrl) {
          const res = await fetch(sheetUrl);
          csv = await res.text();
        } else {
          csv = DEMO_CSV;
        }
        const parsed = parseCSV(csv);
        setProducts(parsed);
        const cats = [...new Set(parsed.map((p) => p.categoria))].sort();
        setCategories(cats);
      } catch (e) {
        setError("No se pudo cargar los productos. Usando datos de demostración.");
        const parsed = parseCSV(DEMO_CSV);
        setProducts(parsed);
        const cats = [...new Set(parsed.map((p) => p.categoria))].sort();
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [sheetUrl]);

  return { products, categories, loading, error };
}
