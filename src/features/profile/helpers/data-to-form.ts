import type { ProfileData, ProfileFormData } from "../types";

function dataToForm(data: ProfileData): ProfileFormData {
  const values: ProfileFormData = {
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
    role: data.role,
    merchant: data.merchant,
  };

  return values;
}

export default dataToForm;
