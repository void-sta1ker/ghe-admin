import type { UseFormInput } from "@mantine/form";
import type { MerchantFormData } from "../types";

export const initialValues: MerchantFormData = {
  name: "",
  phoneNumber: "",
  brandName: "",
  business: "",
  brand: "",
  status: "",
  isActive: true,
};

export const validate: UseFormInput<
  MerchantFormData,
  (values: MerchantFormData) => MerchantFormData
>["validate"] = {
  name: (value) => {
    if (value.trim() === "") {
      return "This field cannot be empty";
    }
    return null;
  },
};
