export interface User {
  user_id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  isLocked: boolean;
}

export interface ApiResponse {
  message: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  resetCode: string;
  success: boolean;
}

export interface ResetPassword {
  email: string;
  code: string;
  newPassword: string;
}
