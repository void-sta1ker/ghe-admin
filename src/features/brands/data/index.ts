import type { UseFormInput } from "@mantine/form";
import type { BrandFormData } from "../types";

export const initialValues: BrandFormData = {
  name: "",
  description: "",
  merchant: "",
  isActive: true,
};

export const fileMap = new Map<string, File>();

export const validate: UseFormInput<
  BrandFormData,
  (values: BrandFormData) => BrandFormData
>["validate"] = {
  name: (value) => {
    if (value.trim() === "") {
      return "This field cannot be empty";
    }
    return null;
  },
};
