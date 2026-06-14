export interface Player {
  id: string;
  name: string;
  email: string;
  balance: number;
  isVerified: boolean;
  role: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}
