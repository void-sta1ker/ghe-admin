import request from "@/utils/axios";
import type { Profile, ProfileData } from "../types";

export async function getProfile(): Promise<Profile> {
  const res: Profile = await request({
    url: "/users/me",
    method: "get",
  });

  return res;
}

export async function updateProfile(
  data: ProfileData,
): Promise<{ success: boolean; message: string; user: Profile }> {
  const res: { success: boolean; message: string; user: Profile } =
    await request({
      url: "/users/me",
      method: "put",
      data,
    });

  return res;
}
