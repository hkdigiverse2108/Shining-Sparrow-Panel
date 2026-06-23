
export interface User {
  name: string;
  email: string;
}

export type UserRole = "admin" | "instructor" | "student";
export type UserStatus = "active" | "inactive" | "blocked";

export interface UserTable {
    id: number;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    status: UserStatus;
    profileImage?: string;
    phone?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: string;
    address?: string;
    permissions?: string[];
    lastLogin?: string;
    createdAt: string;
    updatedAt?: string;
    enrolledCourses?: number[]; 
  attendedWorkshops?: number[]; 
  isBlocked?: string;
  isEmailVerified?: string[];
}


import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface UserFormValues {
  userId?: string;
  fullName?: string;
  phoneNumber?: PhoneNumberType;
  profilePhoto?: string | null;
  email?: string;
  password?: string;
  offers?: string[];
  socialMediaLinks?: string[];
  isActive?: boolean;
  logoTitle?: string;
  isBlocked?: boolean;
}

export type AddUserPayload = UserFormValues;

export type UpdateUserPayload = AddUserPayload;

export type UserBase = UserFormValues & CommonDataType;

export interface UserDataResponse extends PageStatus {
  user_data: UserBase[];
  toatalData: number;
}

export interface UserApiResponse extends MessageStatus {
  data: UserDataResponse;
}

export interface HandlerProps {
  onEdit: (user: UserTable) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (user: any) => void;
  onStartChat?: (user: any) => void;
}
