import type { ProductData } from "../types";

const keys: Array<keyof ProductData> = [
  "name",
  "description",
  "sku",
  "barcode",
  "quantity",
  "price",
  "images",
  "colors",
  "brand",
  "isActive",
];

// // Create a type that checks if a key exists in the interface
// type EnsureKeyExists<T, K extends keyof T> = K extends keyof T ? K : never;

// // Create a type that extracts keys of the interface
// type InterfaceKeys<T> = {
//   [K in keyof T]: EnsureKeyExists<T, K>;
// }[keyof T];

// // Use the InterfaceKeys type to create a tuple type
// type InterfaceKeysTuple = [InterfaceKeys<ProductData>];

// // Test the tuple type
// const keys: InterfaceKeysTuple = ["name", "description", "sku", "barcode", "quantity", "price", "images", "brand", 'isActive']; // This will pass
// const keysWithOmittedKey: InterfaceKeysTuple = ['foo', 'baz']; // This will fail

export default function isProductShape(obj: object): boolean {
  return keys.every((key) => key in obj);
}
