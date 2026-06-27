import * as Yup from "yup";
import { Validation } from "./Validation";

// Login
export const LoginSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Validation("string", "Password"),
});
// Forgot Password
export const ForgotPasswordSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
});
// Verify OTP
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
    title: Yup.string().required("Title is required"),
    subTitle: Yup.string().required("Subtitle is required"),
    language: Yup.string().required("Language is required"),
    duration: Yup.string().required("Duration is required"),
    about: Yup.string().required("About Workshop is required"),
    image: Yup.string().required("Workshop Banner is required"),
    mrpPrice: Yup.number().required("MRP Price is required").min(0, "MRP price must be non-negative"),
    validFor: Yup.string().required("Access Validity is required"),
    priority: Yup.number().required("Priority / Order is required").min(0, "Priority must be at least 0"),
    price: Yup.number().optional().nullable().min(0),
    pdfAttach: Yup.string().optional().nullable(),
    couponCode: Yup.string().optional().nullable(),
});

export const WorkshopAgendaSchema = Yup.object({
    time: Validation("string", "Time"),
    title: Validation("string", "Session Title"),
    desc: Validation("string", "Description"),
});
// Course
export const CourseSchema = Yup.object({
    name: Yup.string().required("Course Name is required"),
    price: Yup.number().required("Main Price is required").min(0, "Price must be non-negative"),
    language: Yup.string().required("Course Language is required"),
    duration: Yup.number().required("Course Duration is required").min(0, "Duration must be positive"),
    accessDurationDays: Yup.number().required("Access Duration is required").min(0, "Access duration must be positive"),
    priority: Yup.number().required("Priority / Order is required").min(0, "Priority must be at least 0"),
    image: Yup.string().required("Course Thumbnail Image is required"),
    description: Yup.string().required("Description is required"),
    mrpPrice: Yup.number().optional().nullable().min(0),
    pdf: Yup.string().optional().nullable(),
    courseCurriculumIds: Yup.array(Yup.string()).optional(),
    trailerUrl: Yup.string().url("Must be a valid URL").nullable().optional(),
    isBlocked: Yup.boolean().optional(),
});
// Lesson
export const LessonSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    duration: Yup.string().required("Duration is required"),
    description: Yup.string().required("Description is required"),
    thumbnail: Yup.string().required("Lesson Thumbnail is required"),
    priority: Yup.number().required("Priority is required").min(0, "Priority must be non-negative"),
    videoLink: Yup.string().optional().nullable(),
    practiceMaterial: Yup.string().optional().nullable(),
    lessonLock: Yup.string().optional(),
});
// Workshop Curriculum
export const WorkshopCurriculumSchema = Yup.object({
    title: Yup.string().required("Session Title is required"),
    priority: Yup.number().required("Priority is required").min(0, "Priority must be non-negative"),
    duration: Yup.number().required("Duration is required").min(0, "Duration must be positive"),
    date: Yup.date().required("Session Date is required").nullable(),
    thumbnail: Yup.string().required("Session Thumbnail is required"),
    description: Yup.string().optional().nullable(),
    videoLink: Yup.string().optional().nullable(),
    attachment: Yup.string().optional().nullable(),
});

// Exam
export const ExamSchema = Yup.object({
    title: Yup.string().required("Exam Title is required"),
    timeLimit: Yup.number().required("Time Limit is required").min(1, "Time limit must be at least 1 minute"),
    totalMarks: Yup.number().required("Total Marks is required").min(1, "Total marks must be at least 1"),
    passingMarks: Yup.number()
        .required("Passing Marks is required")
        .min(0, "Passing marks cannot be negative")
        .test(
            "passing-less-than-total",
            "Warning: Passing marks cannot be greater than total marks",
            function (value) {
                const { totalMarks } = this.parent;
                return value === undefined || totalMarks === undefined || value <= totalMarks;
            }
        ),
    description: Yup.string().optional().nullable(),
    priority: Yup.number().required("Priority is required").min(0, "Priority must be non-negative"),
});

// Question
export const QuestionSchema = Yup.object({
    questionType: Yup.string().required("Question Type is required"),
    score: Yup.number().required("Score / Marks is required").min(0, "Score must be non-negative"),
    priority: Yup.number().required("Priority / Order is required").min(0, "Priority must be non-negative"),
    correctAnswer: Yup.string().required("Correct Answer is required"),
    questionText: Yup.string().when("questionType", {
        is: (val: string) => val === "text",
        then: (schema) => schema.required("Question Prompt / Text is required"),
        otherwise: (schema) => schema.optional(),
    }),
    questionImage: Yup.string().when("questionType", {
        is: (val: string) => val === "image",
        then: (schema) => schema.required("Question Image is required"),
        otherwise: (schema) => schema.optional().nullable(),
    }),
    questionAudio: Yup.string().when("questionType", {
        is: (val: string) => val === "audio",
        then: (schema) => schema.required("Question Audio Resource is required"),
        otherwise: (schema) => schema.optional().nullable(),
    }),
    calculationSteps: Yup.array(Yup.string()).when("questionType", {
        is: (val: string) => val === "calculation",
        then: (schema) => schema.min(1, "Calculation Steps are required").test(
            "non-empty-steps",
            "Calculation Steps cannot contain blank values",
            (val) => Array.isArray(val) && val.length > 0 && val.every((step) => step && step.trim() !== "")
        ),
        otherwise: (schema) => schema.optional(),
    }),
});
export const UserSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    profilePhoto: Yup.string().nullable().optional(),
    isBlocked: Yup.string().optional(),
    isEmailVerified: Yup.string().optional(),
    designation: Yup.string().optional(),
    district: Yup.string().optional(),
    std: Yup.string().optional(),
    reachFrom: Yup.string().optional(),
    schoolName: Yup.string().optional(),
    address: Yup.string().optional(),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Minimum 6 characters required")
        .matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
});

// Edit User Schema (For Updating existing users)
export const EditUserSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    profilePhoto: Yup.string().nullable().optional(),
    designation: Yup.string().optional(),
    district: Yup.string().optional(),
    std: Yup.string().optional(),
    reachFrom: Yup.string().optional(),
    schoolName: Yup.string().optional(),
    address: Yup.string().optional(),
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

// Testimonial Validation
export const editTestimonialSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    rate: Yup.number().required("Rating is required").min(0, "Rating cannot be negative").max(5, "Max rating is 5"),
    description: Yup.string().required("Review Description is required"),
    type: Yup.string().oneOf(["home", "course", "workshop"]).required("Type is required"),
    learningCatalogId: Yup.string().nullable(),
    designation: Yup.string().optional().nullable(),
    image: Yup.string().optional().nullable(),
});

// FAQ Validation
export const FAQSchema = Yup.object({
    questionEn: Yup.string().required("Question (English) is required"),
    answerEn: Yup.string().required("Answer (English) is required"),
    questionHi: Yup.string().optional().nullable(),
    questionGu: Yup.string().optional().nullable(),
    answerHi: Yup.string().optional().nullable(),
    answerGu: Yup.string().optional().nullable(),
    type: Yup.string().oneOf(["home", "course", "workshop"]).required("FAQ Type is required"),
    learningCatalogId: Yup.string().optional().nullable(),
    isFeatured: Yup.boolean().optional(),
    isBlocked: Yup.boolean().optional(),
});

// Coupon Code Validation
export const CouponCodeSchema = Yup.object({
    title: Yup.string().required("Promotion Title is required"),
    code: Yup.string()
        .required("Coupon Code is required")
        .matches(/^[A-Za-z0-9_-]+$/, "Code must contain only alphanumeric characters, dashes, or underscores"),
    discountType: Yup.string().oneOf(["percentage", "flat"]).required("Discount Type is required"),
    discountValue: Yup.number().required("Discount Value is required").min(1, "Value must be at least 1"),
    startDate: Yup.string().required("Start Date is required"),
    endDate: Yup.string().required("End Date is required"),
    usageLimit: Yup.number().required("Total Usage Limit is required").min(1, "Usage limit must be at least 1"),
    appliesTo: Yup.string().oneOf(["course", "workshop", "default"]).required("Applied to target is required"),
    minOrderAmount: Yup.number().optional().nullable(),
    maxDiscountAmount: Yup.number().optional().nullable(),
    specificIds: Yup.array().of(Yup.string()).optional(),
    status: Yup.string().oneOf(["active", "inactive", "expired"]).default("active"),
});

// Contact Details Validation
export const ContactDetailsSchema = Yup.object().shape({
    address: Yup.string().required("Office Address is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Contact Email is required"),
    workingHours: Yup.string().required("Working Hours is required"),
    facebook: Yup.string().url("Must be a valid URL").required("Facebook URL is required"),
    instagram: Yup.string().url("Must be a valid URL").required("Instagram URL is required"),
    linkedin: Yup.string().url("Must be a valid URL").required("LinkedIn URL is required"),
    twitter: Yup.string().url("Must be a valid URL").required("Twitter URL is required"),
});

// Hero Banner Validation
export const HeroBannerSchema = Yup.object({
    title: Yup.string().required("Banner Title is required"),
    description: Yup.string().required("Banner Description is required"),
    type: Yup.string().required("Banner type is required"),
    isBlocked: Yup.boolean().optional(),
});

// Blog Validation
export const BlogSchema = Yup.object({
    title: Yup.string().required("Blog Title is required"),
    category: Yup.string().required("Category is required"),
    content: Yup.string().required("Blog Content is required"),
    coverImage: Yup.string().required("Cover Image is required"),
    subTitle: Yup.string().optional().nullable(),
    mainImage: Yup.string().optional().nullable(),
    author: Yup.string().optional().nullable(),
    quote: Yup.string().optional().nullable(),
    isFeatured: Yup.boolean().optional(),
    isBlocked: Yup.boolean().optional(),
});

// Gallery Validation
export const GallerySchema = Yup.object({
    title: Yup.string().required("Folder Title is required"),
    images: Yup.array()
        .of(Yup.string())
        .required("Select Event Images is required")
        .test("min-one-image", "Select Event Images is required", (val) => {
            if (!val) return false;
            return val.filter((img) => !!img).length > 0;
        }),
    description: Yup.string().optional().nullable(),
});

// Partner Validation
export const PartnerSchema = Yup.object({
    name: Yup.string().required("Partner Name is required"),
    image: Yup.string().required("Partner Logo is required"),
    description: Yup.string().optional().nullable(),
});

export const EditCourseCategorySchema = Yup.object({
    name: Yup.string().required("Category Name is required"),
    image: Yup.string().nullable().optional(),
    description: Yup.string().optional(),
    isFeatured: Yup.string().optional(),
    isBlocked: Yup.string().optional(),
});

export const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string().required("Phone number is required").matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  designation: Yup.string().required("Designation is required"),
  profilePhoto: Yup.string().nullable().optional(),
});

export const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Old password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Minimum 6 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

export const SettingsSchema = Yup.object().shape({
  logo: Yup.string().required("Site logo is required"),
  enrolledLearners: Yup.number().required("Total Enrolled Learners is required").min(0, "Must be at least 0"),
  classCompleted: Yup.number().required("Classes Completed is required").min(0, "Must be at least 0"),
  satisfactionRate: Yup.number().required("Satisfaction Rate is required").min(0, "Must be at least 0").max(100, "Cannot exceed 100"),
  razorpayKey: Yup.string().required("Razorpay Key ID is required"),
  razorpaySecret: Yup.string().required("Razorpay Secret is required"),
});
