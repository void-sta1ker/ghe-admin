import request from "@/utils/axios";
import type { ListResponse } from "@/types";
import type { Product, ProductData, ProductParams } from "../types";

export async function getProducts(
  params?: ProductParams,
): Promise<ListResponse<Product>> {
  const res: ListResponse<Product> = await request({
    url: "/products",
    method: "get",
    params,
  });

  return res;
}

export async function getProduct(id: string): Promise<Product> {
  const res: Product = await request({
    url: `/products/${id}`,
    method: "get",
  });

  return res;
}

export async function createProduct(data: FormData): Promise<ProductData> {
  const res: ProductData = await request({
    url: "/products",
    method: "post",
    data,
  });

  return res;
}

export async function updateProduct(
  id: string,
  data: FormData,
): Promise<ProductData> {
  const res: ProductData = await request({
    url: `/products/${id}`,
    method: "put",
    data,
  });

  return res;
}

export async function deleteProduct(id: string): Promise<void> {
  await request({
    url: `/products/${id}`,
    method: "delete",
  });
}

export async function changeProductStatus(
  id: string,
  status: boolean,
): Promise<void> {
  await request({
    url: `/products/${id}/active`,
    method: "put",
    data: { isActive: status },
  });
}
