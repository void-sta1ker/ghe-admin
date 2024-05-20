interface Profile extends ProfileData {
  id: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  merchant: string;
}

interface ProfileFormData extends ProfileData {}

export type { Profile, ProfileData, ProfileFormData };
