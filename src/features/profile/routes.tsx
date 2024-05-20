/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import type { CustomRoute } from "@/types";

const Profile = lazy(() => import("./views/profile"));

const profileRoutes: CustomRoute = {
  id: "profile",
  title: "Profile",
  path: "profile",
  element: <Profile />,
  children: [],
};

export default profileRoutes;
