import request from "@/utils/axios";
import type { ListResponse } from "@/types";
import type { Merchant, MerchantData, MerchantParams } from "../types";

export async function getMerchants(
  params?: MerchantParams,
): Promise<ListResponse<Merchant>> {
  const res: ListResponse<Merchant> = await request({
    url: "/merchants",
    method: "get",
    params,
  });

  return res;
}

export async function getMerchant(id: string): Promise<Merchant> {
  const res: Merchant = await request({
    url: `/merchants/${id}`,
    method: "get",
  });

  return res;
}

export async function createMerchant(
  data: MerchantData,
): Promise<MerchantData> {
  const res: MerchantData = await request({
    url: "/merchants",
    method: "post",
    data,
  });

  return res;
}

export async function updateMerchant(
  id: string,
  data: MerchantData,
): Promise<MerchantData> {
  const res: MerchantData = await request({
    url: `/merchants/${id}`,
    method: "put",
    data,
  });

  return res;
}

export async function deleteMerchant(id: string): Promise<void> {
  await request({
    url: `/merchants/${id}`,
    method: "delete",
  });
}

export async function changeMerchantStatus(
  id: string,
  status: boolean,
): Promise<void> {
  await request({
    url: `/merchants/${id}/active`,
    method: "put",
    data: { isActive: status },
  });
}

export async function approveMerchant(
  id: string,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/merchants/approve/${id}`,
    method: "put",
  });

  return res;
}

export async function rejectMerchant(
  id: string,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/merchants/reject/${id}`,
    method: "put",
  });

  return res;
}
