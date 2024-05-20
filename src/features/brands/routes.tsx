/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { TbBrandAuth0 } from "react-icons/tb";
import maySee from "@/helpers/may-see";
import Container from "@/components/container";
import type { CustomRoute } from "@/types";

const Brands = lazy(() => import("./views/brands"));
const CreateBrand = lazy(() => import("./views/create-brand"));

const brandsRoutes: CustomRoute | null = maySee({
  id: "brands",
  title: "Brands",
  path: "brands",
  Icon: TbBrandAuth0,
  element: (
    <Container
      of={<Brands />}
      childPaths={["/brands/create", "/brands/:brandId"]}
    />
  ),
  children: [
    {
      id: "create-brand",
      title: "Create Brand",
      path: "create",
      element: <CreateBrand />,
    },
    {
      id: "edit-brand",
      title: "Edit Brand",
      path: ":brandId",
      element: <CreateBrand />,
    },
  ],
});

export default brandsRoutes;
