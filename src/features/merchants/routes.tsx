/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { FaRegBuilding } from "react-icons/fa";
import maySee from "@/helpers/may-see";
import Container from "@/components/container";
import type { CustomRoute } from "@/types";

const Merchants = lazy(() => import("./views/merchants"));
const CreateMerchant = lazy(() => import("./views/create-merchant"));

const merchantsRoutes: CustomRoute | null = maySee({
  id: "merchants",
  title: "Merchants",
  path: "merchants",
  Icon: FaRegBuilding,
  element: (
    <Container
      of={<Merchants />}
      childPaths={["/merchants/create", "/merchants/:merchantId"]}
    />
  ),
  children: [
    {
      id: "create-merchant",
      title: "Create Merchant",
      path: "create",
      element: <CreateMerchant />,
    },
    {
      id: "edit-merchant",
      title: "Edit Merchant",
      path: ":merchantId",
      element: <CreateMerchant />,
    },
  ],
});

export default merchantsRoutes;
