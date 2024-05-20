import request from "@/utils/axios";
import type { BaseParams, ListResponse } from "@/types";
import type { Category, CategoryData } from "../types";

export async function getCategories(
  params?: BaseParams,
): Promise<ListResponse<Category>> {
  const res: ListResponse<Category> = await request({
    url: "/categories",
    method: "get",
    params,
  });

  return res;
}

export async function getCategory(id: string): Promise<Category> {
  const res: Category = await request({
    url: `/categories/${id}`,
    method: "get",
  });

  return res;
}

export async function createCategory(
  data: CategoryData,
): Promise<CategoryData> {
  const res: CategoryData = await request({
    url: "/categories",
    method: "post",
    data,
  });

  return res;
}

export async function updateCategory(
  id: string,
  data: CategoryData,
): Promise<CategoryData> {
  const res: CategoryData = await request({
    url: `/categories/${id}`,
    method: "put",
    data,
  });

  return res;
}

export async function deleteCategory(id: string): Promise<void> {
  await request({
    url: `/categories/${id}`,
    method: "delete",
  });
}

export async function changeCategoryStatus(
  id: string,
  status: boolean,
): Promise<void> {
  await request({
    url: `/categories/${id}/active`,
    method: "put",
    data: { isActive: status },
  });
}
