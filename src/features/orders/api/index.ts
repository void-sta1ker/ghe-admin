import request from "@/utils/axios";
import type { BaseParams, ListResponse } from "@/types";
import type { Order } from "../types";

export async function getOrders(
  params?: BaseParams,
): Promise<ListResponse<Order>> {
  const res: ListResponse<Order> = await request({
    url: "/orders",
    method: "get",
    params,
  });

  return res;
}

export async function getOrder(id: string): Promise<Order> {
  const res: Order = await request({
    url: `/orders/${id}`,
    method: "get",
  });

  return res;
}

export async function changeStatus(
  itemId: string,
  data: { orderId: string; cartId: string; status: string },
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/orders/status/item/${itemId}`,
    method: "put",
    data,
  });

  return res;
}
