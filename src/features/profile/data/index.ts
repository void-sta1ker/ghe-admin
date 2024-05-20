import type { UseFormInput } from "@mantine/form";
import type { ProfileData } from "../types";

export const initialValues: ProfileData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  role: "",
  merchant: "",
};

export const validate: UseFormInput<
  ProfileData,
  (values: ProfileData) => ProfileData
>["validate"] = {
  firstName: (value) => {
    if (value.trim() === "") {
      return "This field cannot be empty";
    }
    return null;
  },
};
