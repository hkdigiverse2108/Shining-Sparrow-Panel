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
// Verify OTP
export const VerifyOtpSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required').min(4, 'OTP must be at least 4 digits'),
});
//Reset Password
export const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Required').min(6, 'Too Short!'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Required'),
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

// User Schema (For Adding new users)
export const UserSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string().optional(),
    profilePhoto: Yup.string().nullable().optional(),
    isBlocked: Yup.string().optional(), 
    isEmailVerified: Yup.string().optional(),
    designation: Yup.string().optional(),
    district: Yup.string().optional(),
    std: Yup.string().optional(),
    reachFrom: Yup.string().optional(),
    schoolName: Yup.string().optional(),
    referralCode: Yup.string().optional(),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Minimum 6 characters required")
        .matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
});

// Edit User Schema (For Updating existing users)
export const EditUserSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string().optional(),
    profilePhoto: Yup.string().nullable().optional(),
    designation: Yup.string().optional(),
    district: Yup.string().optional(),
    std: Yup.string().optional(),
    reachFrom: Yup.string().optional(),
    schoolName: Yup.string().optional(),
    referralCode: Yup.string().optional(),
    isBlocked: Yup.string().optional(), 
    isEmailVerified: Yup.string().optional(), 
    password: Yup.string().optional().min(6, "Minimum 6 characters required"),
});

// Course Category
export const CourseCategorySchema = Yup.object({
    name: Yup.string().required("Category Name is required"),
    image: Yup.string().nullable().optional(),
    description: Yup.string().optional(),
    isFeatured: Yup.string().optional(),
    isBlocked: Yup.string().optional(),
});

export const EditCourseCategorySchema = Yup.object({
    name: Yup.string().required("Category Name is required"),
    image: Yup.string().nullable().optional(),
    description: Yup.string().optional(),
    isFeatured: Yup.string().optional(),
    isBlocked: Yup.string().optional(),
});