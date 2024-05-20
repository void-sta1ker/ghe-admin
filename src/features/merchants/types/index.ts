import type { BaseParams } from "@/types";

interface Merchant extends MerchantData {
  id: string;
}

interface MerchantData {
  name: string;
  phoneNumber: string;
  brandName: string;
  business: string;
  brand: string;
  status: string;
  isActive: boolean;
}

interface MerchantFormData extends MerchantData {}

interface MerchantParams extends BaseParams {}

export type { Merchant, MerchantData, MerchantFormData, MerchantParams };
