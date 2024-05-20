import request from "@/utils/axios";
import type { BaseParams, ListResponse } from "@/types";
import type { Review } from "../types";

export async function getReviews(
  params?: BaseParams,
): Promise<ListResponse<Review>> {
  const res: ListResponse<Review> = await request({
    url: "/reviews",
    method: "get",
    params,
  });

  return res;
}

export async function approveReview(id: string): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/reviews/approve/${id}`,
    method: "put",
  });

  return res;
}

export async function rejectReview(id: string): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/reviews/reject/${id}`,
    method: "put",
  });

  return res;
}
