import { createElement, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "@/Constants";

// Lazy-loaded layouts & pages
const AuthLayout = lazy(() => import("@/Pages/Auth"));
const NotFound = lazy(() => import("@/Pages/NotFound"));
const Login = lazy(() => import("@/Pages/Auth/Login"));
const ForgotPassword = lazy(() => import("@/Pages/Auth/ForgotPassword"));
const Dashboard = lazy(() => import("@/Pages/Dashboard"));
const Courses = lazy(() => import("@/Pages/Course"));
const Workshops = lazy(() => import("@/Pages/Workshop"));
const Profile = lazy(() => import("@/Pages/Profile"));
const Contact = lazy(() => import("@/Pages/Contact"));
const UserManagement = lazy(() => import("@/Pages/UserManagement"));
const UserDetails = lazy(() => import("@/Components/User/UserDetails"));
const VerifyOtp = lazy(() => import("@/Pages/Auth/VerifyOtp"));
const ResetPassword = lazy(() => import("@/Pages/Auth/ResetPassword"));
const ManageContentPage = lazy(() => import("@/Components/Course/ManageContentPage"));
const ExamManagerPage = lazy(() => import("@/Components/Course/ExamManagerPage"));
const QuestionEditorPage = lazy(() => import("@/Components/Course/QuestionEditorPage"));
const LessonEditorPage = lazy(() => import("@/Components/Course/LessonEditorPage"));
const ExamEditorPage = lazy(() => import("@/Components/Course/ExamEditorPage"));
const WorkshopManageContentPage = lazy(() => import("@/Components/Workshop/ManageWorkshop"));
const WorkshopCurriculumEditorPage = lazy(() => import("@/Components/Workshop/CurriculumEditorPage"));
const Blog = lazy(() => import("@/Pages/Blog"));
const HeroBanner = lazy(() => import("@/Pages/HeroBanner"));
const FaqPage = lazy(() => import("@/Pages/Faq"));
const AboutUs = lazy(() => import("@/Pages/AboutUs"));
const Chat = lazy(() => import("@/Pages/Chat"));
const Setting = lazy(() => import("@/Pages/Profile"));
const Coupon = lazy(() => import("@/Pages/Coupon"));
const Legality = lazy(() => import("@/Pages/Legality"));
const Gallery = lazy(() => import("@/Pages/Gallery"));
const GalleryDetails = lazy(() => import("@/Pages/Gallery/GalleryDetails"));
const Newsletter = lazy(() => import("@/Pages/Newsletter"));
const TrustedPartner = lazy(() => import("@/Pages/TrustedPartner"));
const Payments = lazy(() => import("@/Pages/Payments"));
const PaymentDetails = lazy(() => import("@/Pages/Payments/PaymentDetails"));
const FranchiseInquiry = lazy(() => import("@/Pages/FranchiseInquiry"));
const FranchiseInquiryDetails = lazy(() => import("@/Pages/FranchiseInquiry/FranchiseInquiryDetails"));
const TestimonialPage = lazy(() => import("@/Pages/Testimonial"));

export const PageRoutes = [
  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: createElement(Dashboard) },
  { 
    path: "/courses",
    children: [
      { index: true, element: createElement(Courses) }, 
      { path: ":courseId/manage", element: createElement(ManageContentPage) },
      { path: ":courseId/lesson/:lessonId/exam", element: createElement(ExamManagerPage) },
      { path: ":courseId/lesson/:lessonId/exam/edit", element: createElement(ExamEditorPage) },
      { path: ":courseId/lesson/new", element: createElement(LessonEditorPage) },
      { path: ":courseId/lesson/:lessonId/edit", element: createElement(LessonEditorPage) },
      { path: ":courseId/exam/:examId/question/:questionId", element: createElement(QuestionEditorPage) }
    ]
  },
  {
    path: "/workshops",
    children: [
      { index: true, element: createElement(Workshops) },
      { path: ":workshopId/manage", element: createElement(WorkshopManageContentPage) },
      { path: ":workshopId/curriculum/:curriculumId/edit", element: createElement(WorkshopCurriculumEditorPage) },
    ]
  },
  { path: ROUTES.WORKSHOP.BASE, name: PAGE_TITLE.DASHBOARD, element: createElement(Workshops) },
  { path: ROUTES.PROFILE.BASE, name: PAGE_TITLE.PROFILE.BASE, element: createElement(Profile) },
  { path: ROUTES.CONTACT, name: PAGE_TITLE.CONTACT, element: createElement(Contact) },
  { path: ROUTES.USERS.BASE, name: PAGE_TITLE.USERS.BASE, element: createElement(UserManagement) },
  { path: ROUTES.USERS.DETAIL, name: PAGE_TITLE.USERS.DETAILS, element: createElement(UserDetails) },
  { path: ROUTES.BLOG.BASE, name: PAGE_TITLE.BLOG, element: createElement(Blog) },
  { path: ROUTES.HERO_BANNER.BASE, name: PAGE_TITLE.HERO_BANNER, element: createElement(HeroBanner) },
  { path: ROUTES.ABOUT_US, name: PAGE_TITLE.ABOUT_US, element: createElement(AboutUs) },
  { path: ROUTES.CHAT, name: PAGE_TITLE.CHAT, element: createElement(Chat) },
  { path: ROUTES.FAQ, name: PAGE_TITLE.FAQ, element: createElement(FaqPage) },
  { path: ROUTES.SETTING.BASE, name: "Settings", element: createElement(Setting) },
  { path: ROUTES.COUPON_CODE, name: PAGE_TITLE.COUPON_CODE, element: createElement(Coupon) },
  { path: ROUTES.LEGALITY, name: PAGE_TITLE.LEGALITY, element: createElement(Legality) },
  { path: ROUTES.GALLERY, name: PAGE_TITLE.GALLERY, element: createElement(Gallery) },
  { path: ROUTES.GALLERY_DETAILS, name: "Gallery Details", element: createElement(GalleryDetails) },
  { path: ROUTES.NEWSLETTER, name: PAGE_TITLE.NEWSLETTER, element: createElement(Newsletter) },
  { path: ROUTES.TRUSTED_PARTNER, name: PAGE_TITLE.TRUSTED_PARTNER, element: createElement(TrustedPartner) },
  { path: ROUTES.PAYMENTS, name: PAGE_TITLE.PAYMENTS, element: createElement(Payments) },
  { path: ROUTES.PAYMENT_DETAILS, name: PAGE_TITLE.PAYMENT_DETAILS, element: createElement(PaymentDetails) },
  { path: ROUTES.FRANCHISE_INQUIRY, name: PAGE_TITLE.FRANCHISE_INQUIRY, element: createElement(FranchiseInquiry) },
  { path: ROUTES.FRANCHISE_INQUIRY_DETAILS, name: "Franchise Inquiry Details", element: createElement(FranchiseInquiryDetails) },
  { path: ROUTES.TESTIMONIAL, name: PAGE_TITLE.TESTIMONIAL, element: createElement(TestimonialPage) },
];

export const AuthRoutes = [
  {
    element: createElement(AuthLayout),
    children: [
      { path: ROUTES.HOME, element: createElement(Navigate, { to: ROUTES.AUTH.LOGIN, replace: true }) },
      { path: ROUTES.AUTH.LOGIN, element: createElement(Login) },
      { path: ROUTES.FORGOT_PASSWORD.BASE, element: createElement(ForgotPassword) },
      { path: ROUTES.AUTH.VERIFY_OTP , element: createElement(VerifyOtp) },
      { path: ROUTES.AUTH.RESET_PASSWORD , element: createElement(ResetPassword) },
    ],
  },
  { path: "*", element: createElement(NotFound) },
];