export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}
