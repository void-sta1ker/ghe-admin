import type { Product } from "@/features/products";

interface Order extends OrderData {
  id: string;
}

interface OrderData {
  id: string;
  total: number;
  user: { id: string; name: string; phoneNumber: string };
  cart: string;
  products: Array<{
    quantity: number;
    status: string;
    totalPrice: number;
    product: Product;
  }>;
}

export type { Order, OrderData };
