/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { sift } from "radash";
import { routes as authRoutes } from "@/features/auth";
import { routes as dashboardRoutes } from "@/features/dashboard";
import { routes as categoriesRoutes } from "@/features/categories";
import { routes as productsRoutes } from "@/features/products";
import { routes as brandsRoutes } from "@/features/brands";
import { routes as usersRoutes } from "@/features/users";
import { routes as merchantsRoutes } from "@/features/merchants";
import { routes as ordersRoutes } from "@/features/orders";
import { routes as reviewsRoutes } from "@/features/reviews";
import { routes as profileRoutes } from "@/features/profile";
import type { CustomRoute } from "@/types";

// Global Pages
const Root = lazy(() => import("@/views/root"));
const NotFound = lazy(() => import("@/views/not-found"));
const Error = lazy(() => import("@/views/error"));

const routes: CustomRoute[] = [
  {
    id: "root",
    title: "GreenHaven Express Admin Panel",
    path: "/",
    element: <Root getRoutes={() => routes} />,
    loader: async () => null,
    errorElement: <Error />,
    children: sift([
      dashboardRoutes,
      productsRoutes,
      categoriesRoutes,
      brandsRoutes,
      merchantsRoutes,
      usersRoutes,
      ordersRoutes,
      reviewsRoutes,
      profileRoutes,
      {
        id: "not-found",
        title: "Not found",
        path: "*",
        element: <NotFound />,
      },
    ]),
  },
  authRoutes,
];

export default routes;
