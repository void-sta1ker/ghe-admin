import { useLocation } from "react-router-dom";

export default function useTopPath(): string {
  const { pathname } = useLocation();

  return pathname.split("/").slice(0, -1).join("/");
}
