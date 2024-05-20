import { sections, features } from "@/config/constants";
import type { CustomRoute } from "@/types";

export default function maySee(route: CustomRoute): CustomRoute | null {
  const { role } = JSON.parse(
    localStorage.getItem("user") ?? '{"role": ""}',
  ) as {
    role: string;
  };

  if (route.id in features) {
    const accessHolders = sections[route.id as keyof typeof features];

    if (accessHolders.access.includes(role)) {
      return route;
    }
  }

  return null;
}
