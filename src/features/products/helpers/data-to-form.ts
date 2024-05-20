import type { ProductData, ProductFormData } from "../types";

function dataToForm(data: ProductData, files: File[]): ProductFormData {
  const values: ProductFormData = {
    name: data.name,
    description: data.description,
    sku: data.sku,
    barcode: data.barcode,
    quantity: String(data.quantity),
    price: String(data.price),
    discountedPrice: String(data.discountedPrice),
    discountStart:
      data.discountStart !== null ? new Date(data.discountStart) : null,
    discountEnd: data.discountEnd !== null ? new Date(data.discountEnd) : null,
    images: files,
    brand: data.brand,
    colors: data.colors,
    isActive: data.isActive,
  };

  return values;
}

export default dataToForm;
