import { Navigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "@/Constants";
import AuthLayout from "@/Pages/Auth";
import NotFound from "@/Pages/NotFound";
import Login from "@/Pages/Auth/Login";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import Register from "@/Pages/Auth/Register";
import Dashboard from "@/Pages/Dashboard";
import Courses from "@/Pages/Course";
import CourseDetail from "@/Components/Course/CourseDetails";
import Workshops from "@/Pages/Workshop";
import WorkshopDetail from "@/Components/Workshop/WorkshopDetail";
import Profile from "@/Pages/Profile";
import ChangePassword from "@/Pages/Auth/ChangePassword";
import Contact from "@/Pages/Contact";
import UserManagement from "@/Pages/UserManagement";
import ActionCenter from "@/Pages/ActionCenter";
import CalendarAll from "@/Pages/Calendar";
import UserDetails from "@/Components/User/UserDetails";
import Content from "@/Pages/Content";

export const PageRoutes = [
  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.COURSE.BASE, name: PAGE_TITLE.COURSE, element: <Courses /> },
  { path: ROUTES.COURSE.DETAIL, name: PAGE_TITLE.COURSE, element: <CourseDetail /> },
  { path: ROUTES.WORKSHOP.BASE, name: PAGE_TITLE.DASHBOARD, element: <Workshops /> },
  { path: ROUTES.WORKSHOP.DETAIL, name: PAGE_TITLE.DASHBOARD, element: <WorkshopDetail /> },
  { path: ROUTES.PROFILE.BASE, name: PAGE_TITLE.PROFILE.BASE, element: <Profile /> },
  { path: ROUTES.PROFILE.CHANGE_PASSWORD, name: PAGE_TITLE.PROFILE.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: ROUTES.ACTIONCENTER, name: PAGE_TITLE.ACTIONCENTER, element: <ActionCenter /> },
  { path: ROUTES.CONTACT, name: PAGE_TITLE.CONTACT, element: <Contact /> },
  { path: ROUTES.USERS.BASE, name: PAGE_TITLE.USERS.BASE, element: <UserManagement /> },
  { path: ROUTES.USERS.DETAIL, name: PAGE_TITLE.USERS.DETAILS, element: <UserDetails /> },
  { path: ROUTES.CALENDAR, name: PAGE_TITLE.CALENDAR, element: <CalendarAll /> },
  { path: ROUTES.CONTENT, name: PAGE_TITLE.CONTENT, element: <Content /> },
];

export const AuthRoutes = [
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace />, },
      { path: ROUTES.AUTH.LOGIN, element: <Login />, },
      { path: ROUTES.AUTH.REGISTER, element: <Register />, },
      { path: ROUTES.FORGOT_PASSWORD.BASE, element: <ForgotPassword />, },
      
    ],
  },
  { path: "*", element: <NotFound /> },
];
