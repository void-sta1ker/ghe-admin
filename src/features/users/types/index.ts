interface User extends UserData {
  id: string;
}

interface UserData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  password: string;
  merchant: string;
  avatar: string;
  role: string;
}

interface UserFormData extends UserData {}

export type { User, UserData, UserFormData };
