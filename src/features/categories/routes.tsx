/* eslint-disable @typescript-eslint/promise-function-async */
import { lazy } from "react";
import { MdOutlineCategory } from "react-icons/md";
import maySee from "@/helpers/may-see";
import Container from "@/components/container";
import type { CustomRoute } from "@/types";

const Categories = lazy(() => import("./views/categories"));
const CreateCategory = lazy(() => import("./views/create-category"));

const categoriesRoutes: CustomRoute | null = maySee({
  id: "categories",
  title: "Categories",
  path: "categories",
  Icon: MdOutlineCategory,
  element: (
    <Container
      of={<Categories />}
      childPaths={["/categories/create", "/categories/:categoryId"]}
    />
  ),
  children: [
    {
      id: "create-category",
      title: "Create Category",
      path: "create",
      element: <CreateCategory />,
    },
    {
      id: "edit-category",
      title: "Edit Category",
      path: ":categoryId",
      element: <CreateCategory />,
    },
  ],
});

export default categoriesRoutes;
