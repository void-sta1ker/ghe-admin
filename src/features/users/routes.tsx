/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { FiUsers } from "react-icons/fi";
import maySee from "@/helpers/may-see";
import type { CustomRoute } from "@/types";

const Users = lazy(() => import("./views/users"));

const usersRoutes: CustomRoute | null = maySee({
  id: "users",
  title: "Users",
  path: "users",
  element: <Users />,
  Icon: FiUsers,
});

export default usersRoutes;
