import type { BaseParams } from "@/types";
import type { Merchant } from "@/features/merchants";

interface Product extends ProductData {
  id: string;
}

interface ProductData {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  quantity: number;
  price: number;
  discountedPrice: number;
  discountStart: string | null;
  discountEnd: string | null;
  images: Array<{ imageUrl: string; imageKey: string }>;
  colors: string[];
  brand: {
    id: string;
    name: string;
    description: string;
    merchant: Merchant;
    isActive: boolean;
  };
  isActive: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  quantity: string;
  price: string;
  discountedPrice: string;
  discountStart: Date | null;
  discountEnd: Date | null;
  images: File[];
  colors: string[];
  brand: string;
  isActive: boolean;
}

interface ProductParams extends BaseParams {
  ids?: string[];
}

export type { Product, ProductData, ProductFormData, ProductParams };
