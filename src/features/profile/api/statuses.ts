import request from "@/utils/axios";
import type { ListResponse } from "@/types";

export async function getMerchantStatuses(): Promise<ListResponse<string>> {
  const res: ListResponse<string> = await request({
    url: "/statuses/merchant",
    method: "get",
  });

  return res;
}

export async function getReviewStatuses(): Promise<ListResponse<string>> {
  const res: ListResponse<string> = await request({
    url: "/statuses/review",
    method: "get",
  });

  return res;
}

export async function getCartItemStatuses(): Promise<ListResponse<string>> {
  const res: ListResponse<string> = await request({
    url: "/statuses/cart-item",
    method: "get",
  });

  return res;
}
