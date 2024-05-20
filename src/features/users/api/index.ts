import request from "@/utils/axios";
import type { BaseParams, ListResponse } from "@/types";
import type { User } from "../types";

export async function getUsers(
  params?: BaseParams,
): Promise<ListResponse<User>> {
  const res: ListResponse<User> = await request({
    url: "/users",
    method: "get",
    params,
  });

  return res;
}

export default null;
