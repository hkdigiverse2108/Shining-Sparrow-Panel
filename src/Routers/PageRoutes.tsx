import { Navigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "@/Constants";
import AuthLayout from "@/Pages/Auth";
import NotFound from "@/Pages/NotFound";
import Login from "@/Pages/Auth/Login";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import Register from "@/Pages/Auth/Register";
import Dashboard from "@/Pages/Dashboard";
import Courses from "@/Pages/Course";
import Workshops from "@/Pages/Workshop";
import Profile from "@/Pages/Profile";
import ChangePassword from "@/Pages/Auth/ChangePassword";
import Contact from "@/Pages/Contact";
import UserManagement from "@/Pages/UserManagement";
import ActionCenter from "@/Pages/ActionCenter";
import CalendarAll from "@/Pages/Calendar";
import UserDetails from "@/Components/User/UserDetails";
import Content from "@/Pages/Content";
import VerifyOtp from "@/Pages/Auth/VerifyOtp";
import ResetPassword from "@/Pages/Auth/ResetPassword";
import ManageContentPage from "@/Components/Course/ManageContentPage";
import ExamManagerPage from "@/Components/Course/ExamManagerPage";
import QuestionEditorPage from "@/Components/Course/QuestionEditorPage";
import LessonEditorPage from "@/Components/Course/LessonEditorPage";
import ExamEditorPage from "@/Components/Course/ExamEditorPage";
import WorkshopManageContentPage from "@/Components/Workshop/ManageWorkshop";
import WorkshopCurriculumEditorPage from "@/Components/Workshop/CurriculumEditorPage";
import Blog from "@/Pages/Blog";
import HeroBanner from "@/Pages/HeroBanner";
import FaqPage from "@/Pages/Faq";
import AboutUs from "@/Pages/AboutUs";
import Chat from "@/Pages/Chat";

export const PageRoutes = [
  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },
  // { path: ROUTES.COURSE.BASE, name: PAGE_TITLE.COURSE, element: <Courses /> },
  // { path: "/courses/:courseId/manage", name: PAGE_TITLE.COURSE.DETAILS, element: <ManageContentPage /> },
  { path: "/courses",
    children: [
      { index: true, element: <Courses /> }, 
      { path: ":courseId/manage", element: <ManageContentPage /> },
      { path: ":courseId/lesson/:lessonId/exam", element: <ExamManagerPage /> },
      { path: ":courseId/lesson/:lessonId/exam/edit", element: <ExamEditorPage /> },
      { path: ":courseId/lesson/new", element: <LessonEditorPage /> },
      { path: ":courseId/lesson/:lessonId/edit", element: <LessonEditorPage /> },
      { path: ":courseId/exam/:examId/question/:questionId", element: <QuestionEditorPage /> }
    ]
  },
  {
    path: "/workshops",
    children: [
      { index: true, element: <Workshops /> },
      { path: ":workshopId/manage", element: <WorkshopManageContentPage /> },
      { path: ":workshopId/curriculum/:curriculumId/edit", element: <WorkshopCurriculumEditorPage />},
    ]
  },
  { path: ROUTES.WORKSHOP.BASE, name: PAGE_TITLE.DASHBOARD, element: <Workshops /> },
  { path: ROUTES.PROFILE.BASE, name: PAGE_TITLE.PROFILE.BASE, element: <Profile /> },
  { path: ROUTES.PROFILE.CHANGE_PASSWORD, name: PAGE_TITLE.PROFILE.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: ROUTES.ACTIONCENTER, name: PAGE_TITLE.ACTIONCENTER, element: <ActionCenter /> },
  { path: ROUTES.CONTACT, name: PAGE_TITLE.CONTACT, element: <Contact /> },
  { path: ROUTES.USERS.BASE, name: PAGE_TITLE.USERS.BASE, element: <UserManagement /> },
  { path: ROUTES.USERS.DETAIL, name: PAGE_TITLE.USERS.DETAILS, element: <UserDetails /> },
  { path: ROUTES.CALENDAR, name: PAGE_TITLE.CALENDAR, element: <CalendarAll /> },
  { path: ROUTES.CONTENT, name: PAGE_TITLE.CONTENT, element: <Content /> },
  { path: ROUTES.BLOG.BASE, name: PAGE_TITLE.BLOG, element: <Blog /> },
  { path: ROUTES.HERO_BANNER.BASE, name: PAGE_TITLE.HERO_BANNER, element: <HeroBanner /> },
  { path: ROUTES.ABOUT_US, name: PAGE_TITLE.ABOUT_US, element: <AboutUs /> },
  { path: ROUTES.CHAT, name: PAGE_TITLE.CHAT, element: <Chat /> },
  { path: ROUTES.FAQ, name: PAGE_TITLE.FAQ, element: <FaqPage /> },
];

export const AuthRoutes = [
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace />, },
      { path: ROUTES.AUTH.LOGIN, element: <Login />, },
      { path: ROUTES.AUTH.REGISTER, element: <Register />, },
      { path: ROUTES.FORGOT_PASSWORD.BASE, element: <ForgotPassword />, },
      { path: ROUTES.AUTH.VERIFY_OTP , element: <VerifyOtp />, },
      { path: ROUTES.AUTH.RESET_PASSWORD , element: <ResetPassword />, },
      
    ],
  },
  { path: "*", element: <NotFound /> },
];
