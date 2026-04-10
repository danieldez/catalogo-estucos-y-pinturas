export interface Product {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
