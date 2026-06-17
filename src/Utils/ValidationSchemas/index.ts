import * as Yup from "yup";
import { Validation } from "./Validation";

// Login
export const LoginSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Validation("string", "Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
});
// Register
export const RegisterSchema = Yup.object({
    fullname: Validation("string", "Full Name", {
        extraRules: (s) => s.min(2, "Full Name must be at least 2 characters long").max(100, "Full Name must be less than 100 characters long"),
    }),
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Validation("string", "Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    confirmPassword: Validation("string", "Confirm Password", {
        extraRules: (s) => s.oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
});
// Forgot Password
export const ForgotPasswordSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
});
// Change Password
export const ChangePasswordSchema = Yup.object({
    currentPassword: Validation("string", "Current Password"),
    newPassword: Validation("string", "New Password", {
        extraRules: (s) => s
            .min(6, "Minimum 6 characters required")
            .matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    confirmPassword: Validation("string", "Confirm Password", {
        extraRules: (s) => s.oneOf([Yup.ref('newPassword')], "Passwords must match"),
    }),
});
// Workshop
export const WorkshopSchema = Yup.object({
    title: Validation("string", "Title"),
    category: Validation("string", "Category"),
    date: Validation("string", "Date"),
    time: Validation("string", "Time"),
    description: Validation("string", "Description"),
    speakerId: Validation("string", "Speaker"),
});

export const WorkshopAgendaSchema = Yup.object({
    time: Validation("string", "Time"),
    title: Validation("string", "Session Title"),
    desc: Validation("string", "Description"),
});
// Course
export const CourseSchema = Yup.object({
    title: Validation("string", "Course Title"),
    status: Validation("string", "Status"),
    category: Validation("string", "Category"),
    description: Validation("string", "Description"),
    instructorId: Validation("string", "Instructor"),
    price: Validation("string", "Price", {
        extraRules: (s) => s.matches(/^\$?\d+(\.\d{1,2})?$/, "Invalid price format (e.g., $49 or 49.99)"),
    }),
    fullPrice: Yup.string().optional(),
    rating: Yup.string().optional(),
    image: Yup.string().nullable().optional(),
});

export const CurriculumSchema = Yup.object({
    title: Validation("string", "Title"),
    duration: Validation("string", "Duration"),
});

//  User Schema
export const UserSchema = Yup.object({
    username: Validation("string", "Username"),
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Validation("string", "Password", {
        extraRules: (s) => s
            .min(6, "Minimum 6 characters required")
            .matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    role: Validation("string", "Role"),
    status: Validation("string", "Status"),
    profileImage: Yup.string().nullable().optional(),
    phone: Validation("string", "Phone Number"),
    gender: Validation("string", "Gender"),
    dateOfBirth: Yup.string().optional(),
    address: Validation("string", "Address"),
    permissions: Yup.array(Yup.string()).optional(),
});
export const EditUserSchema = Yup.object({
    username: Validation("string", "Username"),
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Yup.string().optional().min(6, "Minimum 6 characters required"),
    role: Validation("string", "Role"),
    status: Validation("string", "Status"),
    // Optional fields
    profileImage: Yup.string().nullable().optional(),
    phone: Yup.string().optional(),
    gender: Yup.string().optional(),
    dateOfBirth: Yup.string().optional(),
    address: Yup.string().optional(),
    permissions: Yup.array(Yup.string()).optional(),
});