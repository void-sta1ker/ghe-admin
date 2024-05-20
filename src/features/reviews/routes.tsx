/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import maySee from "@/helpers/may-see";
import type { CustomRoute } from "@/types";

const Reviews = lazy(() => import("./views/reviews"));

const reviewsRoutes: CustomRoute | null = maySee({
  id: "reviews",
  title: "Reviews",
  path: "reviews",
  element: <Reviews />,
  Icon: MdOutlineRateReview,
});

export default reviewsRoutes;
