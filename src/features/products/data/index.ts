import type { UseFormInput } from "@mantine/form";
import type { ProductFormData } from "../types";

export const initialValues: ProductFormData = {
  name: "",
  description: "",
  sku: "",
  barcode: "",
  quantity: "",
  price: "",
  discountedPrice: "",
  discountStart: null,
  discountEnd: null,
  brand: "",
  images: [],
  colors: [""],
  isActive: true,
};

export const fileMap = new Map<string, File>();

export const validate: UseFormInput<
  ProductFormData,
  (values: ProductFormData) => ProductFormData
>["validate"] = {
  name: (value) => {
    if (value.trim() === "") {
      return "This field cannot be empty";
    }
    return null;
  },
};
