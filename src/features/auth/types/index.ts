interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export type { AuthResponse, User };
