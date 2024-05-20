/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { GrCube } from "react-icons/gr";
import maySee from "@/helpers/may-see";
import Container from "@/components/container";
import type { CustomRoute } from "@/types";

const Products = lazy(() => import("./views/products"));
const CreateProduct = lazy(() => import("./views/create-product"));

const productsRoutes: CustomRoute | null = maySee({
  id: "products",
  title: "Products",
  path: "products",
  Icon: GrCube,
  element: (
    <Container
      of={<Products />}
      childPaths={["/products/create", "/products/:productId"]}
    />
  ),
  children: [
    {
      id: "create-product",
      title: "Create Product",
      path: "create",
      element: <CreateProduct />,
    },
    {
      id: "edit-product",
      title: "Edit Product",
      path: ":productId",
      element: <CreateProduct />,
    },
  ],
});

export default productsRoutes;
