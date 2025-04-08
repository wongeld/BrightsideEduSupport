export type AuthResponse = {
  success: boolean;
  message?: string;
  user?: {
    id: any;
    username: string;
    email: string;
    role: string;
  };
  token?: string; // Make token optional
};
