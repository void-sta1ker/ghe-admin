import type { BrandData, BrandFormData } from "../types";

function dataToForm(data: BrandData): BrandFormData {
  const values: BrandFormData = {
    name: data.name,
    description: data.description,
    merchant: data.merchant,
    isActive: data.isActive,
  };

  return values;
}

export default dataToForm;
