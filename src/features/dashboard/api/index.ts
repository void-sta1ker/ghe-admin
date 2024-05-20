import request from "@/utils/axios";
import type { Summary, StatusProgress } from "../types";

export async function getSummary(): Promise<Summary> {
  const res: Summary = await request({
    url: "/dashboard/summary",
    method: "get",
  });

  return res;
}

export async function getDashboardStatuses(): Promise<StatusProgress> {
  const res: StatusProgress = await request({
    url: "/dashboard/statuses",
    method: "get",
  });

  return res;
}

export async function getTopProducts(): Promise<void> {
  const res: void = await request({
    url: "/dashboard/top-products",
    method: "get",
  });

  return res;
}

export async function getCustomerGrowth(): Promise<void> {
  const res: void = await request({
    url: "/dashboard/customer-growth",
    method: "get",
  });

  return res;
}

export async function getTotalSales(): Promise<void> {
  const res: void = await request({
    url: "/dashboard/total-sales",
    method: "get",
  });

  return res;
}

export async function getCategoricalSales(): Promise<void> {
  const res: void = await request({
    url: "/dashboard/categorical-sales",
    method: "get",
  });

  return res;
}
