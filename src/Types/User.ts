
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
}


export interface HandlerProps {
  onEdit: (user: UserTable) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}