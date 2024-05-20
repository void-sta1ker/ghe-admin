import request from "@/utils/axios";
import type { BaseParams, ListResponse } from "@/types";
import type { Brand, BrandData } from "../types";

export async function getBrands(
  params?: BaseParams,
): Promise<ListResponse<Brand>> {
  const res: ListResponse<Brand> = await request({
    url: "/brands",
    method: "get",
    params,
  });

  return res;
}

export async function getBrand(id: string): Promise<Brand> {
  const res: Brand = await request({
    url: `/brands/${id}`,
    method: "get",
  });

  return res;
}

export async function createBrand(data: FormData): Promise<BrandData> {
  const res: BrandData = await request({
    url: "/brands",
    method: "post",
    data,
  });

  return res;
}

export async function updateBrand(
  id: string,
  data: FormData,
): Promise<BrandData> {
  const res: BrandData = await request({
    url: `/brands/${id}`,
    method: "put",
    data,
  });

  return res;
}

export async function deleteBrand(id: string): Promise<void> {
  await request({
    url: `/brands/${id}`,
    method: "delete",
  });
}

export async function changeBrandStatus(
  id: string,
  status: boolean,
): Promise<void> {
  await request({
    url: `/brands/${id}/active`,
    method: "put",
    data: { isActive: status },
  });
}
