import type { MerchantData, MerchantFormData } from "../types";

function dataToForm(data: MerchantData, file?: File): MerchantFormData {
  const values: MerchantFormData = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    brandName: data.brandName,
    business: data.business,
    brand: data.brand,
    status: data.status,
    isActive: data.isActive,
  };

  return values;
}

export default dataToForm;
