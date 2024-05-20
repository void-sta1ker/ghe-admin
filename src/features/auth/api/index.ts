import request from "@/utils/axios";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "../types";

export async function login(data: {
  phoneNumber: string;
  password: string;
}): Promise<AuthResponse> {
  const res: AuthResponse = await request({
    url: "/auth/login",
    method: "post",
    data,
    params: { platform: "admin_panel" },
  });

  return res;
}

export async function refreshToken(data: {
  refresh: string;
}): Promise<AxiosResponse<AuthResponse>> {
  const res = await request({
    url: "/account/me/refresh/",
    method: "post",
    data,
  });

  return res;
}

export async function checkPhone(data: {
  token: string;
  phoneNumber: string;
  otp: string;
}): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: "/auth/check-phone",
    method: "post",
    data,
  });

  return res;
}
