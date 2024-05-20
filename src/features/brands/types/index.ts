interface Brand extends BrandData {
  id: string;
}

interface BrandData {
  name: string;
  description: string;
  merchant: string;
  isActive: boolean;
}

interface BrandFormData {
  name: string;
  description: string;
  merchant: string;
  isActive: boolean;
}

export type { Brand, BrandData, BrandFormData };
