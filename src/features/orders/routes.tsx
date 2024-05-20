/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import maySee from "@/helpers/may-see";
import type { CustomRoute } from "@/types";

const Orders = lazy(() => import("./views/orders"));

const ordersRoutes: CustomRoute | null = maySee({
  id: "orders",
  title: "Orders",
  path: "orders",
  element: <Orders />,
  Icon: FaRegFileAlt,
});

export default ordersRoutes;
