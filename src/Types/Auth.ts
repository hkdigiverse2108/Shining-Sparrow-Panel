import type { CommonDataType, MessageStatus } from "./Common";

// ************ Login ***********
export interface LoginPayload {
  email: string;
  password: string;
  userType: string;
}

export interface ChangePasswordPayload {
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
export interface User extends LoginPayload, CommonDataType {
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  role: string;
}

export interface LoginResponse extends MessageStatus {
  data: {
    token: string;
    _id: string;
    email: string;
    fullName: string;
    role: string;
    isEmailVerified: boolean;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface UpdatePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  designation?: string;
  profilePhoto?: string | null;
}
