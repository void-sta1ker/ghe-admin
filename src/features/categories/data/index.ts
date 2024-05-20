import type { UseFormInput } from "@mantine/form";
import type { CategoryFormData } from "../types";

export const initialValues: CategoryFormData = {
  name: "",
  description: "",
  slug: "",
  products: [],
  isActive: true,
};

export const validate: UseFormInput<
  CategoryFormData,
  (values: CategoryFormData) => CategoryFormData
>["validate"] = {
  name: (value) => {
    if (value.trim() === "") {
      return "This field cannot be empty";
    }
    return null;
  },
};
