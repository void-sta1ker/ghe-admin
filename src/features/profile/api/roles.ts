import request from "@/utils/axios";
import type { ListResponse } from "@/types";

export async function getRoles(): Promise<ListResponse<string>> {
  const res: ListResponse<string> = await request({
    url: "/roles",
    method: "get",
  });

  return res;
}

export default null;
