import type {
  IndexRouteObject,
  NonIndexRouteObject,
  RouteObject,
} from "react-router-dom";
import type { IconType } from "react-icons/lib";

type AppLang = "en" | "ru" | "uz";

interface RouteExtensions {
  id: string;
  title?: string;
  Icon?: IconType;
}

interface CustomNonIndexRouteObject extends NonIndexRouteObject {
  children?: Array<RouteObject & RouteExtensions>;
}

type CustomRoute = (IndexRouteObject | CustomNonIndexRouteObject) &
  RouteExtensions;

interface BaseEntity {
  id: number | string;
  name: string;
  // [key: string]: unknown;
}

interface BaseParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ListResponse<T> {
  count: number;
  results: T[];
}

export type { CustomRoute, BaseEntity, BaseParams, ListResponse, AppLang };
