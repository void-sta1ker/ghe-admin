/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import maySee from "@/helpers/may-see";
import type { CustomRoute } from "@/types";

const Dashboard = lazy(() => import("./views/dashboard"));

const dashboardRoutes: CustomRoute | null = maySee({
  id: "dashboard",
  title: "Dashboard",
  path: "dashboard",
  element: <Dashboard />,
  Icon: MdOutlineDashboard,
});

export default dashboardRoutes;
