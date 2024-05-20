/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import type { CustomRoute } from "@/types";

const Auth = lazy(() => import("./views/auth"));
const Login = lazy(() => import("./views/login"));

const authRoutes: CustomRoute = {
  id: "auth",
  title: "Auth",
  path: "auth",
  element: <Auth />,
  children: [
    {
      id: "login",
      title: "Login",
      path: "login",
      element: <Login />,
    },
  ],
};

export default authRoutes;
